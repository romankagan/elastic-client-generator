import {RestSpecMapping} from "./specification/rest-spec-mapping";
import _ from "lodash";

namespace Domain {

  export class Type {
    constructor(public name: string) {}
    nullable: boolean;
  }
  export class ArrayOf {
    type = new Type("array");
    of: InstanceOf;
  }
  export class Dictionary {
    type = new Type("dictionary");
    key: InstanceOf;
    value: InstanceOf;
  }
  export class UnionOf {
    type = new Type("dictionary");
    items: InstanceOf[] = [];
  }
  export type InstanceOf = Type|ArrayOf|Dictionary|UnionOf;

  export class TypeDeclaration {
    constructor(public name: string) {}
  }

  export class Interface extends TypeDeclaration {
    properties: InterfaceProperty[] = [];
    inheritsFromUnresolved: string[] = [];
    inherits: Domain.Interface[] = [];
  }

  export class InterfaceProperty {
    constructor(public name: string, public isRequestParameter: boolean) {}
    type: InstanceOf;
  }

  export class Enum extends TypeDeclaration {
    constructor(public name: string, public flags: boolean = false) { super(name); }
    members: EnumMember[] = [];
  }

  export class EnumMember {
    constructor(public name: string) {}
  }

  export class BodyDocumentation {
    description: string;
    required: boolean;
    constructor(data: any) {
      this.description = data.description;
      this.required = !!data.required;
    }
  }
  export class Documentation {
    description: string;
    url: string;
    constructor(data: any) {
      this.description = data.description;
      this.url = data.url;
    }
  }
  export enum Stability { stable, beta, experimental }

  export class Deprecation {
    version: string;
    description: string;
    constructor(data: any) {
      this.version = data.version;
      this.description = data.description;
    }
  }

  export class Endpoint {
    name: string;
    typeMapping: RestSpecMapping;

    documentation: Documentation;
    stability: Stability;
    body: BodyDocumentation;
    url: Url;
    queryStringParameters: QueryStringParameter[] = [];
    deprecated: Deprecation;

    constructor(file: string, restSpecMapping: { [p: string]: RestSpecMapping }) {
      const json = require(file);
      // @ts-ignore
      this.name = _(json).keys().first();
      this.typeMapping = restSpecMapping[this.name];
      const data = json[this.name];

      this.documentation = new Documentation(data.documentation);
      // @ts-ignore
      this.queryStringParameters = _(data.params).map((v, k) => new QueryStringParameter(k, v)).value();

      if (data.body)
        this.body  = new BodyDocumentation(data.body);
      if (data.deprecated)
        this.deprecated = new Deprecation(data.deprecated);

      switch(data.stability)
      {
        case "stable": this.stability =  Stability.stable; break;
        case "beta": this.stability = Stability.stable; break;
        case "experimental": this.stability = Stability.stable; break;
      };

      this.url = new Url(data.url);
    }
  }
  export class UrlPath {
    path: string;
    methods: string[];
    parts: RoutePart[];
    deprecated: Deprecation;
    constructor(data: any) {
      this.path = data.path;
      this.methods = data.methods;
      // @ts-ignore
      this.parts = _(data.parts).map((v, k) => new RoutePart(k, v)).value();
      if (data.deprecated)
        this.deprecated = new Deprecation(data.deprecated);
    }
  }

  export class Url {
    paths: UrlPath[];

    constructor(data: any) {
      // @ts-ignore
      this.paths = _(data.paths).map(p => new UrlPath(p)).value();
    }
  }
  export class RestSpecTypeConverter {
    // https://github.com/elastic/elasticsearch-net/blob/master/src/CodeGeneration/ApiGenerator/Domain/ApiQueryParameters.cs
    static toQueryStringType(name: string, specType: string): string {
      if (name === "routing") return "Routing";
      const fieldsParams = ["fields", "_source_include", "_source_exclude"];
      const isFields = fieldsParams.some(n => n === name) || name.endsWith("_fields");
      const isField = name.indexOf("field") >= 0;
      if (isFields || isField) {
        switch (specType) {
          case "list": return "Fields";
          case "string": return isField ? "Field" : "Fields";
        }
      }

      const doubleFields = ["boost", "percen", "score"];
      const isDoubleField = doubleFields.some(n => name.toLowerCase().indexOf(n) >= 0);
      switch (specType) {
        case "boolean": return "boolean";
        case "list": return "string"; // todo array of strings should be a string with a comment
        case "integer": return "int";
        case "date": return "Date";
        case "enum": return name; // todo LOOKUP
        case "number":
          return isDoubleField ? "double" : "long";
        case "duration":
        case "time":
          return "Time";
        case "text":
        case "string":
        case "":
        case null:
          return "string";
      }
      return specType + "_";
    }

    static toRouteParamType(name: string, specType: string): string {
      // https://github.com/elastic/elasticsearch-net/blob/master/src/CodeGeneration/ApiGenerator/Domain/ApiUrlPart.cs
      switch (name) {
        case "index":
        case "new_index":
          return specType === "string" ? "IndexName" : "Indices";
        case "target":
          return "IndexName";
        case "type": return specType === "string" ? "TypeName" : "Types";
        case "watch_id":
        case "job_id":
        case "datafeed_id":
        case "snapshot_id":
        case "filter_id":
        case "id": return specType === "string" ? "Id" : "Ids";
        case "category_id": return "CategoryId";
        case "nodes":
        case "node_id": return specType === "string" ? "NodeId" : "NodeIds";
        case "scroll_id": return specType === "string" ? "ScrollId" : "ScrollIds";
        case "field":
        case "fields": return specType === "string" ? "Field" : "Fields";
        case "index_metric": return "IndexMetrics";
        case "metric":
        case "watcher_stats_metric":
          return "Metrics";
        case "feature": return "Features";
        case "action_id": return "ActionIds";
        case "repository":
        case "snapshot":
        case "lang":
        case "username":
        case "usernames":
        case "realm":
        case "realms":
        case "alias":
        case "context":
        case "name":
        case "thread_pool_patterns":
          return specType === "string" ? "Name" : "Names";
        case "parent_task_id":
        case "task_id": return "TaskId";
        case "timestamp": return "Timestamp";
        default: return specType + "_";
      }
    }
  }

  export class QueryStringParameter {
    name: string;
    type: string;
    description: string;
    required: boolean;
    default: boolean;

    constructor(name: string, data: any) {
      this.name = name;
      this.type = RestSpecTypeConverter.toQueryStringType(name, data.type);
      this.description = data.description || name;
      this.required = !!data.required;
      this.default = data.default || null;
    }
  }

  export class RoutePart {
    name: string;
    type: string;
    description: string;
    required: boolean;

    constructor(name: string, data: any) {
      this.name = name;
      this.type = RestSpecTypeConverter.toRouteParamType(name, data.type);
      this.description = data.description || name;
      this.required = !!data.required;
    }
  }

}
export = Domain;
