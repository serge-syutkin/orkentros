import Head from "next/head";
import Layout from "../../components/Layout";

// Reached by direct link only. Nothing on the site points here, this page is
// absent from the sitemap, and the noindex below is what actually keeps it
// out of search: an unlinked address still reaches Google through browsers,
// referrers and whoever forwards the link. robots.txt would be the wrong
// tool — a crawler has to be let in to read the noindex.
//
// The fragment is written into the page rather than fetched from Sanity. It
// is one fixed reward for the buyers of the first run, not something the
// author will revise; if that changes, it belongs in Sanity with the rest.
const PAGE_TITLE = "El Noble y el Guardián — El Mundo del Orkentros";

export default function LlamaAzulExclusivo() {
  return (
    <>
      <Head>
        <title>{PAGE_TITLE}</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="robots" content="noindex" />
      </Head>

      <Layout>
        <section className="article_hero u-section">
          <div className="u-container">
            <div className="article_hero_layout">
              <h1 className="article_title">El Noble y el Guardián</h1>
            </div>
          </div>
        </section>

        <section className="article_content u-section">
          <div className="u-container-article">
            {/* The same wrapper the articles use, so the invented names keep
                the italics the author marked them with and the glossary gets
                the list styling the template already defines. */}
            <div className="article_rte w-richtext">
              {/* The two opening lines are a lede, not part of the fragment.
                  The document the author sent breaks here, and the ordinary
                  paragraph gap does not read as a break. */}
              <div className="exclusivo_lede">
                <p>
                  Fragmento exclusivo para quienes hayan adquirido{" "}
                  <em>El Despertar de la Llama Azul</em>.
                </p>

                <p>
                  Un adelanto de El Noble y el Guardián, próxima entrega de{" "}
                  <em>El Mundo del Orkentros</em>.
                </p>
              </div>

              <p>
                En el sitio más recóndito del interior de la montaña, a la luz
                del fuego, los <em>Veisak</em> –adivinos que con el poder de las
                sombras accedían al destino trazado en la Roca que Sostiene al
                Mundo– afilaron los cuchillos. Después hicieron cortes a lo
                largo de sus antebrazos, sobre numerosas cicatrices. La sangre
                caliente comenzó a escurrir. Con ella hicieron un trazo oscuro
                en la frente y el resto la ofrecieron como tributo al Dios del
                Caos y al Ser dueño de las <em>Morkoggan</em>.
              </p>

              <p>
                Solo los <em>Veisak</em> tenían la capacidad de vislumbrar el
                futuro. El único modo de que se les revelara lo que está trazado
                en el destino era entregando algo de ellos e ingresando al
                abismo en el que reside ese Ser oscuro, frío y misterioso. Al
                salir del abismo, algo de la oscuridad permanecía en ellos,
                acabándolos lentamente, como si se tratara de un veneno.
              </p>

              <p>
                Mientras tanto, los <em>Visader</em> esperaban sin ir a
                descansar. En sus manos estaba el control del{" "}
                <em>Orkentros</em>, artefacto de incalculable poder que mantenía
                la Armonía y evitaba que el mundo se cubriera de oscuridad. Por
                otro lado, el resto de <em>Felliand</em> en Tafengaur se
                enteraban de la noticia de los dos nacidos.
              </p>

              <p>
                Fue hasta antes del amanecer, en la hora más oscura de la noche,
                que los tres <em>Veisak</em> salieron del abismo y se reunieron
                con los ocho <em>Visader</em>.
              </p>

              <p>
                —Las profecías que hemos visto no les agradarán —dijo Barne, el
                más antigüo de los <em>Veisak</em>, cubierto con la capa y la
                capucha. Rehuía de la luz, ocultando su rostro deformado y la
                piel manchada de oscuridad—. No hay duda de ello, pues los tres
                hemos visto lo mismo con distinto grado de claridad.
              </p>

              <p>
                »No es casualidad que el nacimiento de estos dos{" "}
                <em>Felliand</em> se haya retrasado, provocando la muerte de la
                madre, hasta esta noche de tormenta, entre el día de{" "}
                <em>Nertiri</em> y <em>Tornomont</em>, pues son{" "}
                <em>Filontred</em>.
              </p>

              <p>
                —¿«Hijos de Dioses»? ¿Cómo es posible eso? —inquirió el{" "}
                <em>Visader</em> encargado de la Estancia de los Hombres.
              </p>

              <p>
                —Son <em>Felliand</em>, pero han sido elegidos por los Dioses,
                tienen en su sangre el linaje de <em>Nertiri</em> y{" "}
                <em>Tornomont</em> —respondió—. Por eso están destinados a ser
                más que seres Plenos, más que cualquiera de nosotros. Sucedió
                algo similar cuando los Dioses le otorgaron los dones y la
                plenitud a los primeros de los <em>Felliand</em>.
              </p>

              <p>
                —¿Están seguros de que son <em>Filontred</em>? —preguntó Laonen.
              </p>

              <p>
                —Lo aseguramos, tienen el linaje de los Dioses —dijo otro{" "}
                <em>Veisak</em> que no se cubría, llamado Heimdar, que todavía
                no sufría transformaciones notables por las Sombras del Caos.
              </p>

              <p>
                —El nacido de pelo negro es ‘el Noble’, con el linaje de{" "}
                <em>Tornomont</em>. El de pelo rubio es ‘el Guardián’, con el
                linaje de <em>Nertiri</em> —dijo Barne “el Oso”—. Sus nombres
                llegarán a tierras más allá de los bordes del mapa y serán
                recordados hasta el fin de las Edades. Traerán mucha abundancia
                a seres Plenos y Hombres… Sin embargo, a uno de los dos se le
                cubrirá la mente de sombras, provocando un irremediable caos en
                la Armonía, la ruina del mundo, la caída de la Orden y la
                pérdida del <em>Orkentros</em>, causando el fin de esta Edad…
              </p>

              <p>
                —¿Qué? —exclamó el <em>Visader</em> encargado de la Estancia del
                Orden. Él no fue el único en reaccionar así—. ¿Cómo que «la
                caída de la Orden»?
              </p>

              <p>
                —Eso ha sido trazado en la roca que sostiene al mundo —continuó
                el <em>Veisak</em>—. Por causa de uno de estos nacidos habrá
                caos y destrucción, las <em>Morkoggan</em> volverán a
                amenazarnos y las cosas no volverán a ser las mismas.
              </p>

              <p>
                —¿Quién de los dos será? —fue la pregunta que más se escuchó
                entre las que hicieron los <em>Visader</em>.
              </p>

              <p>—Eso no nos ha sido revelado.</p>

              <p>
                —¿Y nosotros qué podemos hacer? —preguntaron alarmados—. Tenemos
                el <em>Orkentros</em>, ¿cómo podemos evitar la destrucción que
                auguran?
              </p>

              <p>
                —No se puede, aunque se tenga el <em>Orkentros</em> —declaró
                fulminante Barne y dirigió sus ojos oscuros y trémulos a los{" "}
                <em>Visader</em>—. Saben bien que lo que se intente hacer para
                evitar lo trazado en el destino será lo que al final provoque su
                concreción. Lo trazado en la roca que sostiene al mundo sucederá
                de cualquier modo.
              </p>

              <p>
                Los <em>Visader</em> se quedaron en silencio.
              </p>

              <p>
                —Pero hemos vislumbrado un posible destino —intervino Sotar, el{" "}
                <em>Veisak</em> que hasta el momento no había hablado; como
                Heimdar, también se mostraba descubierto—. El otro de los
                nacidos, el que no será causante de la destrucción, le dará una
                posibilidad al mundo, a los <em>Felliand</em> y a los Hombres
                para que resurja la Armonía, pues un enorme caos precede a un
                nuevo orden.
              </p>

              <p>
                —¿Quién de los dos será, el de pelo oscuro o rubio? —quisieron
                saber.
              </p>

              <p>
                —¡Que eso no nos ha sido revelado! —replicó Heimdar, escupiendo
                saliva negra que le quedó en la barbilla. Por la agitación, algo
                de su rostro quedó descubierto. Donde debía haber nariz solo
                había un bulto con dos orificios y una cicatriz oscura.
              </p>

              <p>
                —Eso es lo que hemos vislumbrado, es el destino de los{" "}
                <em>Filontred</em> —declaró Barne—. Cuando deseen consultarnos
                estaremos en lo más hondo de la cueva.
              </p>

              <p>
                Los <em>Veisak</em> se marcharon a lo más recóndito de la Orden,
                donde la luz de la oscuridad y el silencio predominaba.
              </p>

              <h2>Glosario</h2>

              <ul>
                <li>
                  <em>Felliand</em>: Seres Plenos, más longevos que los Hombres
                </li>
                <li>
                  <em>Morkoggan</em>: Sombras del Caos
                </li>
                <li>
                  <em>Nertiri</em>: Diosa, la que protege
                </li>
                <li>
                  <em>Orkentros</em>: Artefacto mágico que controla los poderes
                  y el destino del mundo
                </li>
                <li>
                  <em>Tornomont</em>: Dios, el que atormenta
                </li>
                <li>
                  <em>Veisak</em>: Adivino
                </li>
                <li>
                  <em>Visader</em>: Mago miembro de La Orden
                </li>
              </ul>
            </div>
          </div>
        </section>
      </Layout>
    </>
  );
}
