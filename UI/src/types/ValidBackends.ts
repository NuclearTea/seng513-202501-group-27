import { BackendType } from "../proto/filetree/filetree_pb";

export type ValidBackends = "Node.JS" | "Python" | "Ruby" | "Java (Spring)";

export function isValidBackendStr(str: string): str is ValidBackends {
  switch (str) {
    case "Node.JS":
    case "Python":
    case "Ruby":
    case "Java (Spring)":
      return true;
    default:
      return false;
  }
}

export const isValidBackendType = (num: number): boolean => {
  switch (num) {
    case BackendType.NODEJS:
    case BackendType.FLASK:
    case BackendType.JAVA:
    case BackendType.RUBY:
      return true;
    default:
      return false;
  }
};

export const validBackendStrToEnum = (str: ValidBackends): BackendType => {
  switch (str) {
    case "Node.JS":
      return BackendType.NODEJS;
    case "Python":
      return BackendType.FLASK;
    case "Ruby":
      return BackendType.RUBY;
    case "Java (Spring)":
      return BackendType.JAVA;
  }
};
