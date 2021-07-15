# Tragamonedas

Este proyecto esta construido como un sitio web MVC usando el framework .NET 5. Como tal hace uso de las herramientas que proporciona el propio framework. Además he añadido algunos paquetes y librerias adicionales para ayudar a simplificar el codigo que se detallaran en cada una de las secciones.

# Términos
Slot: Ranuras


# En cuanto al front-end se implementó de la siguiente manera:
La lógica de esta sección se encuentra en el folder wwwroot.

Las paginas html se renderizan a partir de las views que se encuentran implementadas en los archivos cshtml.

La mayoría de la logica se maneja con javascript con ayuda en algunas ocasiones de jquery para simplicar el codigo sobre todo en las llamadas al backend cuya implementación se encuentra en el archivo site.js.

La animación en css se logra con el uso de un sprite con las imagenes solicitadas. La logica que hace girar las imagenes se encuentra en la funcion SPIN que maneja la logica de envio de peticiones al servidor. Este sprite simplifica la cantidad de imagenes que se necesitan usar ademas de proporcionar un medio para que la animacion se pueda lograr. La implementación de los estilos se encuentra en el archivo site.css.

La tirada inicial es manejada por la funcion play que sigue los requerimientos indicados. Cada vez que recibimos la respuesta del servidor se espera un 1 segundo para dejar de girar el primer slot, 2 para el segundo y 3 para el tercero. Esta logica se maneja en el front-end y no en el backend ya que de hacerlo en el backend no cumpliriamos con los rangos indicados en segundos.

Las tiradas cuando los creditos estan por encima de 39 creditos tienen una logica distinta para simular una tirada normal pero que estan manejadas con la logica en el back-end.

# En cuanto al back-end se implementó de la siguiente manera:
Las tiradas por encima de 39 creditos estan manejadas por la logica en el back-end usando el patron strategy. De esta manera se mantiene la lógica separada y es mas fácil de mantener.

El manejo de la session es solo hecho a nivel del controlador.

Se implementó una inyección de dependencias para permitir hacer mas fácil las pruebas unitarias.

La estrutura del proyecto usa un light domain driven design separando el diseño de la implementación. Esto se nota en la separacion de clases en proyectos fuera del proyecto web. Estas clases son usadas en diferentes partes de la aplicacion por lo que abstraerlas del proyecto principal hace sentido.

# En cuanto a las pruebas
Las pruebas se encuentran en el proyecto TragamonedasTest.

Todas las pruebas se realizaron sobre la lógica del negocio que se definió en el servicio PlayService.

Se implementó una clase TestSettings para hacer el setup inicial para las pruebas.

Los test de probabilidad siguen la siguiente logica:

La probabilidad de las tiradas random son de alrededor de 80% de pérdidas así que la prueba utiliza una simulación de 100 tiradas para ver que tan probable es ganar.

La probabilidad de la tirada de 40 a 60 créditos evidencia una bajada sensible en la cantidad de tiradas ganadoras. Ya que hay un 30% mas de probabilidad de volver a tirar se redujo la cantidad de jugadas ganadoras esperadas aproximadamente en el mismo porcentaje.

La probabilidad de la tirada de 60 a más créditos evidencia una bajada adicional en la cantidad de tiradas ganadoras pero que adicional hace más probable que las tiradas ganadoras generen nuevas tiradas ganadoras ya que es más probable también el volver a tirar. Igualmente se reduce el porcentaje de jugadas ganadoras esperado.



