function timeConversion(n) {
 
  var num = n;
  var hours = num / 60;
  var rhours = Math.floor(hours);
  var minutes = (hours - rhours) * 60;
  var rminutes = Math.round(minutes);
  return rhours + "h" + rminutes + "m";
}

export default timeConversion;

export const dateFormat=(n)=>{
const [year,month,day]=n.split('-').map((x)=>parseInt(x))

return `${months[month-1]} ${day},${year}`
}
const months = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "June",
  "July",
  "Aug",
  "Sept",
  "Oct",
  "Nov",
  "Dec",
];
