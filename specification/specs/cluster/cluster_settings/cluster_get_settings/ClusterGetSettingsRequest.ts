@rest_spec_name("cluster.get_settings")
class ClusterGetSettingsRequest extends RequestBase {
	@request_parameter()
	flat_settings: boolean;
	@request_parameter()
	include_defaults: boolean;
	@request_parameter()
	master_timeout: Time;
	@request_parameter()
	timeout: Time;
}
