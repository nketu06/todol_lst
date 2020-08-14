module.exports=getdate;
function getdate()
{

let today = new Date();
let option = {
  weekday: "long",
  day: "numeric",
  month: "long"
};
  let day = today.toLocaleDateString("hi-IN", option);
  return day;

}
