/**
 * Solves a quadratic equation of the form ax^2 + bx + c = 0.
 * @param a The coefficient of x^2.
 * @param b The coefficient of x.
 * @param c The constant term.
 * @returns An array containing the roots of the equation or a message if there are no real solutions.
 */
export const solveQuadratic = (a: number, b: number, c: number): (readonly number[] | string) => {
  if (a === 0) {
      if (b === 0) {
          return c === 0 ? "Infinite solutions" : "No solution";
      }
      // Linear case: ax + b = 0 where a is 0
      return [-c / b];
  }

  const discriminant = b * b - 4 * a * c;
  if (discriminant > 0) {
      const root1 = (-b + Math.sqrt(discriminant)) / (2 * a);
      const root2 = (-b - Math.sqrt(discriminant)) / (2 * a);
      return [root1, root2];
  } else if (discriminant === 0) {
      const root = -b / (2 * a);
      return [root];
  } else {
      return "No real solutions";
  }
};
