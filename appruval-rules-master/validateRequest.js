module.exports = {
  compare: function (a, b) {
    console.log("a->" + a.length)
    console.log("b->" + b.length)

    if (a.length != b.length) {
      return "Debe ingresar los " + a.length + " campos obligatorios";
    }
    else {
      if (a.length > 0) {
        for (i = 0; i < a.length; i++) {
          if (a[i] != b[i]) {

            return "El campo ingresado [" +b[i]+ "] es incorrecto, deberia ser: ["+a[i]+"]";

          }
        }
        return "0";
      }
      else{
        return "Los campos no pueden estar vacios";
      }
    }
    return "Error inalcanzable";
  }
}
