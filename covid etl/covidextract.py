import json
import logging
import subprocess
import pandas as pd
from datetime import datetime, timedelta
from airflow import DAG
from airflow.operators.python import PythonOperator
from airflow.providers.postgres.hooks.postgres import PostgresHook

CONFIG_PATH = "/opt/airflow/config/config.json"

with open(CONFIG_PATH, "r") as config_file:
    CONFIG = json.load(config_file)

def ensure_dependencies():
    try:
        import openpyxl
    except ImportError:
        subprocess.check_call(["pip", "install", "openpyxl"])

def extract_and_load(sheet_name, table_name, required_columns):
    try:
        ensure_dependencies()

        logging.info(f"Reading Excel file: {CONFIG['EXCEL_FILE_PATH']} (Sheet: {sheet_name})...")
        df = pd.read_excel(CONFIG["EXCEL_FILE_PATH"], sheet_name=sheet_name, engine="openpyxl")

        df.columns = df.columns.str.strip().str.lower().str.replace(" ", "_").str.replace("%", "").str.replace("(", "").str.replace(")", "")

        clean_required_columns = [col.lower().replace(" ", "_").replace("%", "").replace("(", "").replace(")", "") for col in required_columns]

        missing_columns = [col for col in clean_required_columns if col not in df.columns]
        if missing_columns:
            raise ValueError(f"Missing required columns in {sheet_name}: {missing_columns}")

        clean_required_columns += ["etl_loaded_date", "file_name"]
        df["etl_loaded_date"] = pd.Timestamp.now().strftime("%Y-%m-%d %H:%M:%S")
        df["file_name"] = CONFIG["file_name"]

        data = [tuple(row[col] for col in clean_required_columns) for _, row in df.iterrows()]

        data = [row for row in data if any(row)]

        logging.info(f"Required columns: {clean_required_columns}")
        logging.info(f"First 5 extracted rows for {sheet_name}: {data[:5]}")

        placeholders = ', '.join(['%s'] * len(clean_required_columns))
        insert_query = f"""
            INSERT INTO {table_name} ({', '.join(clean_required_columns)})
            VALUES ({placeholders})
        """
        logging.info(f"Generated Query for {table_name}: {insert_query}")

        logging.info(f"Connecting to PostgreSQL for table: {table_name}...")
        pg_hook = PostgresHook(postgres_conn_id=CONFIG["POSTGRES_CONN_ID"])

        with pg_hook.get_conn() as conn:
            with conn.cursor() as cursor:
                if data:
                    cursor.executemany(insert_query, data)
                    conn.commit()
                    logging.info(f"Successfully inserted {len(data)} rows into {table_name}.")
                else:
                    logging.warning(f"No valid data found for {table_name}. Skipping insertion.")

    except Exception as e:
        logging.error(f"Error in extract_and_load for {sheet_name}: {e}", exc_info=True)
        raise

default_args = {
    'owner': 'airflow',
    'start_date': datetime(2024, 3, 2),
    'catchup': False,
    'retries': 1,
    'retry_delay': timedelta(minutes=5)
}

dag = DAG(
    dag_id='covid_effects_extract_dag',
    default_args=default_args,
    schedule_interval=None,
    catchup=False
)

# Create tasks dynamically based on config
tasks = []
for dataset in CONFIG["DATASETS"]:
    task = PythonOperator(
        task_id=f'extract_{dataset["sheet_name"].lower().replace(" ", "_")}',
        python_callable=extract_and_load,
        op_args=[dataset["sheet_name"], dataset["table_name"], dataset["required_columns"]],
        execution_timeout=timedelta(minutes=60),
        dag=dag
    )
    tasks.append(task)

# Set task dependencies (execute sequentially)
for i in range(len(tasks) - 1):
    tasks[i].set_downstream(tasks[i + 1])