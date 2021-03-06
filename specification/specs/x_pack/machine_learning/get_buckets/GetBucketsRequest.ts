@rest_spec_name("ml.get_buckets")
class GetBucketsRequest extends RequestBase {
	anomaly_score: double;
	desc: boolean;
	end: Date;
	exclude_interim: boolean;
	expand: boolean;
	page: Page;
	sort: Field;
	start: Date;
}
