export default function assert(expression, error_message){
  if(!expression){
    throw new Error(error_message);
  }
}
