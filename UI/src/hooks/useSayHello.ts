import { useState } from "react";

// // @ts-expect-error: CommonJS modules
// import * as proto from "../../gen/web/greeter_pb";
// // @ts-expect-error: CommonJS modules
// import * as services from "../../gen/web/greeter_grpc_web_pb";
//

import { GreeterClient } from "../../gen/web/GreeterServiceClientPb.ts";
import { HelloRequest } from "../../gen/web/greeter_pb";
export function useSayHello() {
  const [response, setResponse] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const client = new GreeterClient("http://localhost:8080");

  const sayHello = (name: string) => {
    setLoading(true);
    setError(null);

    const req = new HelloRequest();
    req.setName(name);

    client.sayHello(req, {}, (err, res) => {
      setLoading(false);
      if (err) {
        setError(err.message);
        setResponse(null);
      } else {
        setResponse(res.getMessage());
      }
    });
  };

  return { sayHello, response, loading, error };
}
