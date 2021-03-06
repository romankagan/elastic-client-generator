@rest_spec_name("ml.close_job")
class CloseJobRequest extends RequestBase {
	@request_parameter()
	allow_no_jobs: boolean;
	@request_parameter()
	force: boolean;
	@request_parameter()
	timeout: Time;
}
