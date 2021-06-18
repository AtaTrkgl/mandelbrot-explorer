
class Complex {
    constructor(re, im){
        this.re = re;
        this.im = im;
    }

    abs(){
        return Math.sqrt(this.re ** 2 + this.im ** 2);
    }

    static multiply(num1, num2){
        // (a + bi) * (c + di) = ac + adi + bci + bdi^2
        // which can be written as: ac - bd + (ad + bc)i

        return new Complex(num1.re * num2.re - num1.im * num2.im, 
            num1.re * num2.im + num1.im * num2.re);
    }

    static add(num1, num2){
        return new Complex(num1.re + num2.re, num1.im + num2.im);
    }
}