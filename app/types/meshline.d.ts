import { Object3DNode } from "@react-three/fiber";

declare module "@react-three/fiber" {
  interface ThreeElements {
    meshLineGeometry: Object3DNode<any, any>;
    meshLineMaterial: Object3DNode<any, any>;
  }
}
