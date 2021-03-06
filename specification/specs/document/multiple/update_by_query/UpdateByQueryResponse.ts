class UpdateByQueryResponse extends ResponseBase implements IResponse {
	is_valid: boolean;
	batches: long;
	failures: BulkIndexByScrollFailure[];
	noops: long;
	requests_per_second: float;
	retries: Retries;
	task: TaskId;
	timed_out: boolean;
	took: long;
	total: long;
	updated: long;
	version_conflicts: long;
}
