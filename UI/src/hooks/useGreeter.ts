import { useCallback, useState } from "react";
import { HelloRequest, HelloReply } from "../proto/greeter_pb";
import { GreeterClient } from "../proto/GreeterServiceClientPb";
const client = new GreeterClient("http://localhost:8081", null, {
  format: "text",
});

export const useGreeter = () => {
  const [reply, setReply] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const sayHello = useCallback((name: string) => {
    const request = new HelloRequest();
    request.setName(name);

    setLoading(true);
    setReply(null);
    setError(null);

    client
      .sayHello(request)
      .then((res: HelloReply) => {
        setReply(res.getMessage());
      })
      .catch((err) => {
        setError(err.message);
      })
      .finally(() => setLoading(false));
  }, []);

  return { reply, loading, error, sayHello };
};
