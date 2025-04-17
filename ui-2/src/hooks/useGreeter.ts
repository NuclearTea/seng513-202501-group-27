import { useCallback, useState } from "react";
import { RpcError } from "grpc-web";
const Greeter = require("../proto/greeter_grpc_web_pb.js");
const greeter = require("../proto/greeter_pb.js");

// Use the Promise-based client
const client = new Greeter.GreeterPromiseClient(
  "http://localhost:8081",
  null,
  null,
);

export const useGreeter = () => {
  const [reply, setReply] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const sayHello = useCallback((name: string) => {
    const request = new greeter.HelloRequest();
    request.setName(name);

    setLoading(true);
    setReply(null);
    setError(null);

    client
      .sayHello(request)
      .then((res: any) => {
        setReply(res.getMessage());
      })
      .catch((err: RpcError) => {
        setError(err.message);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  return {
    reply,
    loading,
    error,
    sayHello,
  };
};
