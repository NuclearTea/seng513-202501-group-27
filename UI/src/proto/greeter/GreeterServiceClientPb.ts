/**
 * @fileoverview gRPC-Web generated client stub for greeter
 * @enhanceable
 * @public
 */

// Code generated by protoc-gen-grpc-web. DO NOT EDIT.
// versions:
// 	protoc-gen-grpc-web v1.5.0
// 	protoc              v3.19.6
// source: greeter.proto


/* eslint-disable */
// @ts-nocheck


import * as grpcWeb from 'grpc-web';

import * as greeter_pb from './greeter_pb'; // proto import: "greeter.proto"


export class GreeterClient {
  client_: grpcWeb.AbstractClientBase;
  hostname_: string;
  credentials_: null | { [index: string]: string; };
  options_: null | { [index: string]: any; };

  constructor (hostname: string,
               credentials?: null | { [index: string]: string; },
               options?: null | { [index: string]: any; }) {
    if (!options) options = {};
    if (!credentials) credentials = {};
    options['format'] = 'text';

    this.client_ = new grpcWeb.GrpcWebClientBase(options);
    this.hostname_ = hostname.replace(/\/+$/, '');
    this.credentials_ = credentials;
    this.options_ = options;
  }

  methodDescriptorSayHello = new grpcWeb.MethodDescriptor(
    '/greeter.Greeter/SayHello',
    grpcWeb.MethodType.UNARY,
    greeter_pb.HelloRequest,
    greeter_pb.HelloReply,
    (request: greeter_pb.HelloRequest) => {
      return request.serializeBinary();
    },
    greeter_pb.HelloReply.deserializeBinary
  );

  sayHello(
    request: greeter_pb.HelloRequest,
    metadata?: grpcWeb.Metadata | null): Promise<greeter_pb.HelloReply>;

  sayHello(
    request: greeter_pb.HelloRequest,
    metadata: grpcWeb.Metadata | null,
    callback: (err: grpcWeb.RpcError,
               response: greeter_pb.HelloReply) => void): grpcWeb.ClientReadableStream<greeter_pb.HelloReply>;

  sayHello(
    request: greeter_pb.HelloRequest,
    metadata?: grpcWeb.Metadata | null,
    callback?: (err: grpcWeb.RpcError,
               response: greeter_pb.HelloReply) => void) {
    if (callback !== undefined) {
      return this.client_.rpcCall(
        this.hostname_ +
          '/greeter.Greeter/SayHello',
        request,
        metadata || {},
        this.methodDescriptorSayHello,
        callback);
    }
    return this.client_.unaryCall(
    this.hostname_ +
      '/greeter.Greeter/SayHello',
    request,
    metadata || {},
    this.methodDescriptorSayHello);
  }

}

