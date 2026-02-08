from datetime import date, datetime
import boto3
from fastapi import HTTPException
from fastapi.logger import logger
from dotenv import load_dotenv
import os 
load_dotenv()


s3_client = boto3.client(
    "s3",
    aws_access_key_id=os.environ.get("AWS_ACCESS_KEY_ID"),
    aws_secret_access_key=os.environ.get("AWS_SECRET_ACCESS_KEY"),
    region_name=os.environ.get("AWS_S3_REGION_NAME"),
)

def generate_s3_presigned_url(
    object_path, expiration=3600, bucket_name=os.environ.get("AWS_STORAGE_BUCKET_NAME")
):
    logger.info(f"Generating presigned url for {object_path}")
    try:
        s3 = boto3.client(
            "s3",
            aws_access_key_id=os.environ.get("AWS_ACCESS_KEY_ID"),
            aws_secret_access_key=os.environ.get("AWS_SECRET_ACCESS_KEY"),
            region_name=os.environ.get("AWS_S3_REGION_NAME"),
        )
        response = s3.generate_presigned_url(
            "get_object",
            Params={
                "Bucket": bucket_name,
                "Key": object_path,
            },
            ExpiresIn=expiration,
        )
        logger.info(f"Presigned url generated for {object_path}")
        return response
    except Exception as e:
        logger.info(f"Error generating presigned url for {object_path} : {e}")
        return None



def save_object_to_s3(object_file, attribute, file_type, filename):
    todays_date = date.today()
    current_datetime = datetime.now()
    s3_path_prefix = "media/"
    s3_path = f"{attribute}/{file_type}/{todays_date.year}/{todays_date.month}/{todays_date.day}/{current_datetime.hour}/{current_datetime.minute}/{current_datetime.second}/{current_datetime.microsecond//1000}/{filename}.pdf"
    s3_path = s3_path.replace(" ", "_")
    try:
        s3_client.upload_fileobj(
            object_file, os.environ.get("AWS_STORAGE_BUCKET_NAME"), f"{s3_path_prefix}{s3_path}"
        )
        file_url = s3_path
        return file_url
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error uploading file: {str(e)}")