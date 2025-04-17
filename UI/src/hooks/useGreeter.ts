// UI/src/hooks/useGreeter.ts
import { useState } from "react";
// import { HelloRequest, HelloReply } from "../../gen/greeter_pb";
// import { GreeterClient } from "../../gen/GreeterServiceClientPb";
// import { GreeterClient } from "../proto/GreeterServiceClientPb";
// import { HelloRequest, HelloReply } from "../proto/greeter_pb";
import { GreeterClientImpl } from "../proto/greeter";
import type { RpcError } from "grpc-web";

const client = GreeterClientImpl("http://localhost:8080");

export function useGreeter() {
  const [response, setResponse] = useState<HelloReply | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<RpcError | null>(null);

  const sayHello = async (name: string) => {
    setLoading(true);
    setError(null);
    // const request: HelloRequest = {
    //   $typeName: "greeter.HelloRequest",
    //   name,
    // };
    request.setName(name);
    try {
      const reply = await client.sayHello(request, {});
      setResponse(reply);
    } catch (err) {
      setError(err as RpcError);
    } finally {
      setLoading(false);
    }
  };

  return { sayHello, response, loading, error };
}
