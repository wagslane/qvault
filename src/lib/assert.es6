export default function assert(expression, error_message){
  if(!expression){
    alert(error_message);
    throw new Error(error_message);
  }
}
