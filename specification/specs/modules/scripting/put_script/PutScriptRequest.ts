@rest_spec_name("put_script")
class PutScriptRequest extends RequestBase {
	script: StoredScript;
	@request_parameter()
	master_timeout: Time;
	@request_parameter()
	timeout: Time;
}
