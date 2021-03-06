@rest_spec_name("indices.get_field_mapping")
class GetFieldMappingRequest extends RequestBase {
	@request_parameter()
	allow_no_indices: boolean;
	@request_parameter()
	expand_wildcards: ExpandWildcards;
	@request_parameter()
	ignore_unavailable: boolean;
	@request_parameter()
	include_defaults: boolean;
	@request_parameter()
	include_type_name: boolean;
	@request_parameter()
	local: boolean;
}
