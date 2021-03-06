@rest_spec_name("indices.exists")
class IndexExistsRequest extends RequestBase {
	@request_parameter()
	allow_no_indices: boolean;
	@request_parameter()
	expand_wildcards: ExpandWildcards;
	@request_parameter()
	flat_settings: boolean;
	@request_parameter()
	ignore_unavailable: boolean;
	@request_parameter()
	include_defaults: boolean;
	@request_parameter()
	local: boolean;
}
