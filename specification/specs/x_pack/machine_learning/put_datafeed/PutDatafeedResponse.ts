class PutDatafeedResponse extends ResponseBase implements IResponse {
	aggregations: Dictionary<string, AggregationContainer>;
	chunking_config: ChunkingConfig;
	datafeed_id: string;
	frequency: Time;
	indices: Indices;
	job_id: string;
	query: QueryContainer;
	query_delay: Time;
	script_fields: Dictionary<string, ScriptField>;
	scroll_size: integer;
}
