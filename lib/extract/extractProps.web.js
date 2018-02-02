function replaceKey(obj,old_key, new_key) {
    if(obj[old_key]){
        console.log("replacing:", old_key, " with ",  new_key);
      obj[old_key] = ob[new_key];
      delete obj[old_key];
  }
};
export default function(props, ref) {
    // translate from the react-native-svg to HTML svg props
    replaceKey(props,"deltaX","dx");
    replaceKey(props,"deltaY","dy");
    replaceKey(props,"positionX","x");
    replaceKey(props,"positionY","y");

    return props;
}
