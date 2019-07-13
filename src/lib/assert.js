export default function assert(expression, error_message){
  if(!expression){
    throw error_message;
  }
}
