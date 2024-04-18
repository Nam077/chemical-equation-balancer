export interface ChemistryResult {
  left: string[];
  right: string[];
  element: any;
  data: {
    dataLeft: any;
    dataRight: any;
  };
  result: {
    resultLeft: any;
    resultRight: any;
  };
  text: string;
}

export function getChemistryEquationBalancer(str: string): ChemistryResult {
  //remove space
  str = str.replace(/\s/g, ""); // Replace spaces
  str = str.replace(/\[|\]/g, ")"); // Replace [ and ]
  str = str.replace(/\{|\}/g, ")"); // Replace { and }
  str = str.replace(/=>|->|⟶|⇒|⇔|↔/g, "=");
  //get left right
  let left: any = str.split("=")[0];
  let right: any = str.split("=")[1];

  left = left.split("+");
  right = right.split("+");

  const dataLeft: any = {};
  for (const x in left) {
    dataLeft[left[x]] = componentAnalysis(left[x]);
  }

  const dataRight: any = {};
  for (const x in right) {
    dataRight[right[x]] = componentAnalysis(right[x]);
  }

  const element_HH: any = {};
  for (const x in dataLeft) {
    for (const y in dataLeft[x]) {
      element_HH[y] = (element_HH[y] != null ? element_HH[y] : 0) + 1;
    }
  }
  const N = left.length + right.length;
  let M = 0;
  for (const x in element_HH) {
    x
    M++;
  }

  let arr = initArray(N, M);

  let i = 0;
  for (const x in element_HH) {
    let j = 0;
    for (const y in dataLeft) {
      arr[i][j++] = dataLeft[y][x] == null ? 0 : dataLeft[y][x];
    }
    for (const y in dataRight) {
      arr[i][j++] = dataRight[y][x] == null ? 0 : -dataRight[y][x];
    }
    i++;
  }
  arr = ladderMatrix(arr);
  arr = diagonalMatrix(arr);
  const result_array = getResultArray(arr);
  i = 0;
  const resultLeft: any = {};
  for (const y in dataLeft) {
    resultLeft[y] = result_array[i++];
  }
  const resultRight: any = {};
  for (const y in dataRight) {
    resultRight[y] = result_array[i++];
  }

  let text = "";
  for (const x in resultLeft) {
    text = text + (resultLeft[x] > 1 ? resultLeft[x] : "") + x + " + ";
  }
  text = text.substring(0, text.length - 3);
  text = text + " = ";
  for (const x in resultRight) {
    text = text + (resultRight[x] > 1 ? resultRight[x] : "") + x + " + ";
  }
  text = text.substring(0, text.length - 3);

  return {
    left: left,
    right: right,
    element: element_HH,
    data: {
      dataLeft: dataLeft,
      dataRight: dataRight,
    },
    result: {
      resultLeft: resultLeft,
      resultRight: resultRight,
    },
    text: text,
  };
}

function componentAnalysis(str: string) {
  str = str + "Z";
  //Fe2(SO4)3
  const data: any = {};
  let element = "";
  let quantity = "";
  for (let i = 0; i < str.length; i++) {
    if (str[i] >= "0" && str[i] <= "9") {
      quantity = quantity + str[i];
    } else if (str[i] >= "A" && str[i] <= "Z") {
      if (element.length > 0) {
        data[element] =
          (typeof data[element] !== "undefined"
            ? Math.floor(data[element])
            : 0) + (quantity.length > 0 ? Math.floor(Number(quantity)) : 1);
        element = "";
        quantity = "";
      }
      element = element + str[i];
    } else if (str[i] >= "a" && str[i] <= "z") {
      element = element + str[i];
    }
    if (str[i] === "(") {
      if (element.length > 0)
        data[element] =
          (typeof data[element] !== "undefined"
            ? Math.floor(data[element])
            : 0) + (quantity.length > 0 ? Math.floor(Number(quantity)) : 1);
      element = "";
      quantity = "";
      let count = 1;
      let str2 = "";
      i++;
      while (count > 0 && i < str.length) {
        if (str[i] === "(") count++;
        if (str[i] === ")") count--;
        if (count === 0) break;
        str2 = str2 + str[i];
        i++;
      }
      i++;
      while (str[i] >= "0" && str[i] <= "9" && i < str.length) {
        quantity = quantity + str[i++];
      }
      i--;
      if (quantity.length == 0) quantity = "1";
      const sub_data = componentAnalysis(str2);
      for (const x in sub_data) {
        data[x] =
          (data[x] != null ? data[x] : 0) +
          Math.floor(sub_data[x]) * Math.floor(Number(quantity));
      }
      element = "";
      quantity = "";
    }
  }
  return data;
}

function initArray(N: number, M: number) {
  const arr: number[][] = [];
  for (let i = 0; i < M; i++) {
    arr[i] = [];
    for (let j = 0; j < N; j++) {
      arr[i][j] = 0;
    }
  }
  return arr;
}

function ladderMatrix(arr: number[][]) {
  const M = arr.length;
  const N = arr[0].length;
  for (let i = 0; i < M - 1; i++) {
    let indexNotZero = i;
    for (let j = i; j < M; j++) {
      if (arr[j][i] != 0) {
        const temp = arr[indexNotZero];
        arr[indexNotZero] = arr[j];
        arr[j] = temp;
        indexNotZero++;
      }
    }
    for (let j = i; j < M; j++) {
      if (arr[j][i] < 0)
        for (let k = i; k < N; k++) {
          arr[j][k] *= -1;
        }
    }
    for (let j = i + 1; j < M; j++) {
      if (arr[j][i] == 0) break;
      const lcm = Number(lcmTwoNumbers(arr[i][i], arr[j][i]));
      const k1 = lcm / arr[j][i];
      const k2 = lcm / arr[i][i];
      for (let k = 0; k < N; k++) {
        arr[i][k] *= k2;
        arr[j][k] *= k1;
      }
      for (let k = 0; k < N; k++) {
        arr[j][k] -= arr[i][k];
      }
    }
  }
  for (let i = M - 1; i >= 0; i--) {
    let checkRowZero = true;
    for (let j = 0; j < N; j++) {
      if (arr[i][j] !== 0) {
        checkRowZero = false;
        break;
      }
    }
    if (checkRowZero) arr.splice(i, 1);
  }
  return arr;
}

function diagonalMatrix(arr: any) {
  const M = arr.length;
  const N = arr[0].length;
  for (let i = M - 1; i >= 0; i--) {
    for (let j = i - 1; j >= 0; j--) {
      if (arr[j][i] == 0) continue;
      const lcm = Number(lcmTwoNumbers(arr[i][i], arr[j][i]));
      const k1 = lcm / arr[j][i];
      const k2 = lcm / arr[i][i];
      for (let k = 0; k < N; k++) {
        arr[i][k] *= k2;
        arr[j][k] *= k1;
      }
      for (let k = 0; k < N; k++) {
        arr[j][k] -= arr[i][k];
      }
    }
  }
  return arr;
}

function getResultArray(arr: any) {
  const M = arr.length;
  const N = arr[0].length;
  const result = [];
  let lcm = 1;
  for (let i = 0; i < M; i++) {
    lcm = Number(lcmTwoNumbers(lcm, arr[i][i]));
  }
  lcm = Math.abs(lcm);
  result[N - 1] = lcm;
  for (let i = M - 1; i >= 0; i--) {
    result[i] = (-lcm * arr[i][N - 1]) / arr[i][i];
  }
  let gcd = result[0];
  for (let i = 0; i < N; i++) {
    gcd = gcdTwoNumbers(gcd, result[i]);
  }
  for (let i = 0; i < N; i++) {
    result[i] /= gcd;
  }
  return result;
}

function lcmTwoNumbers(x: number, y: number) {
  if (typeof x !== "number" || typeof y !== "number") return false;
  return !x || !y ? 0 : (x * y) / gcdTwoNumbers(x, y);
}

function gcdTwoNumbers(x: number, y: number) {
  x = Math.abs(x);
  y = Math.abs(y);
  while (y) {
    const t = y;
    y = x % y;
    x = t;
  }
  return x;
}
console.log(getChemistryEquationBalancer('H2 + O2 = H2O'));
