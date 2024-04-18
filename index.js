function componentAnalysis(str){
  str = str + "Z";
  //Fe2(SO4)3
  const data = {};
  let element = "";
  let quantity = "";
  for (let i = 0; i < str.length; i++) {
      if (str[i] >= '0' && str[i] <= '9') {
        console.log(str[i]);
          quantity = quantity + str[i];
      } else if (str[i] >= 'A' && str[i] <= 'Z') {
          if (element.length > 0) {
              data[element] = ((typeof data[element] !== 'undefined') ? Math.floor(data[element]) : 0) +
                  ((quantity.length > 0) ? Math.floor(quantity) : 1);
              element = "";
              quantity = "";
          }
          element = element + str[i];
      } else if (str[i] >= 'a' && str[i] <= 'z') {
          element = element + str[i];
      } if (str[i] === '(') {
          if (element.length > 0)
              data[element] = ((typeof data[element] !== 'undefined') ? Math.floor(data[element]) : 0) +
                  ((quantity.length > 0) ? Math.floor(quantity) : 1);
          element = "";
          quantity = "";
          let count = 1;
          let str2 = "";
          i++;
          while(count > 0 && i < str.length) {
              if (str[i] === '(')
                  count++;
              if (str[i] === ')')
                  count--;
              if (count === 0)
                  break;
              str2 = str2 + str[i];
              i++;
          }
          i++;
          while(str[i] >= '0' && str[i] <= '9' && i < str.length){
              quantity = quantity + str[i++];
          }
          i--;
          if (quantity.length == 0)
              quantity = '1';
          let sub_data = componentAnalysis(str2);
          for (let x in sub_data) {
              data[x] = ((data[x] != null) ? data[x] : 0) +
                  Math.floor(sub_data[x]) * Math.floor(quantity);
          }
  console.log(quantity);
          element = "";
          quantity = "";
      }
  }
  return data;
}

console.log(componentAnalysis("Fe2(SO4)3"));
