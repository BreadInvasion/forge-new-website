// images
declare module '*.png' {
    const src: string;
    export default src;
}
declare module '*.jpg' {
    const src: string;
    export default src;
}
declare module '*.jpeg' {
    const src: string;
    export default src;
}
declare module '*.svg' {
    const src: string;
    export default src;
}
declare module "*.scss";
declare module '*.svg?url' {
  const content: string;
  export default content;
}
declare module "*.css";
declare module '*.png?url' {
  const src: string
  export default src
}