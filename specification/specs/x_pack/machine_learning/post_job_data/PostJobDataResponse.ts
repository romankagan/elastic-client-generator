class PostJobDataResponse extends ResponseBase implements IResponse {
	bucket_count: long;
	earliest_record_timestamp: Date;
	empty_bucket_count: long;
	input_bytes: long;
	input_field_count: long;
	input_record_count: long;
	invalid_date_count: long;
	job_id: string;
	last_data_time: Date;
	latest_record_timestamp: Date;
	missing_field_count: long;
	out_of_order_timestamp_count: long;
	processed_field_count: long;
	processed_record_count: long;
	sparse_bucket_count: long;
}
