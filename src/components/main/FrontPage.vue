<template>
  <div>
    <div class="row">
      <div class="col">
        <img id="front-page-image" src="../../assets/loppi1.jpg" alt="Studying drillcores at the GTK's Loppi field station, Finland"/>
      </div>
    </div>

    <div class="row">
      <div class="col">
        <h3>Data portal</h3>
        <p>
          EUROCORE educational data portal provides access to the detailed geological datasets collected from ore exploration drill
          cores. One can find traditional core logs as well as data collected with novel exploration techniques such as field
          portable spectroscopic devices, automated analytical tools and X-ray computed tomography in the EUROCORE database.
          The targeted drill cores represent different genetic types of ore deposits and show various modes of ore occurrences
          and grades. The drill cores are deposited by several universities and research institution across Europe and will be
          exploited for developing advanced practical workshops on mineral exploration for MSc training. The data portal allows
          user to search over wide range of information including geological descriptions, raw analytical data, image files,
          etc. Data tables and graphs could be exported to the external applications via common spreadsheet and vector graphic
          formats. EUROCORE portal software is developed as open source project (<a target="_blank" href="https://github.com/geocollections/eurocore">https://github.com/geocollections/eurocore</a>)
          and hosted by Tallinn University of Technology. All data and materials accessible through the portal could be freely
          used for non-commercial purposes, taken that appropriate reference to the data owner and EUROCORE portal are provided.
        </p>
      </div>
      <div class="col">
        <h3>Data providers</h3>
        <p>The Geological Survey of Finland acts as the primary data provider of the drill core logging data and geological information.
          The drill core log and assay data are also provided by several mining companies includingAgnico Eagle Mines Limited,
          Boliden Group and Yara International ASA. Data collected with In Situ field devices are provided by the University
          of Lorraine and X-ray computed tomography data by Fraunhofer-Gesellschaft. Mineral deposits data, which could be accessed
          through data portal are harvested from the Fennoscandian Mineral Database (<a target="_blank" href="http://gtkdata.gtk.fi/fmd/">http://gtkdata.gtk.fi/fmd/</a>).</p>
      </div>
      <div class="col">
        <h3>EUROCORE project</h3>
        <p>
          Project funded by EIT Raw Materials wants to assist the mining industry in the formation of students (Master, PhD) and mining
          company personnel on the use of innovative In Situ technologies for exploring metals from core samples. Training people
          at the continent scale requires a full kit: core samples from various ore types, detailed knowledge on cores, including
          its inside structure, field devices for training on manual measurements, automated data acquisition for providing large
          datasets management exercises, data management capabilities and ready-to-use workshops calling up teaching skills and
          methods. EUROCORE portal aims to provide teaching aid for geological master courses by delivering exploration datasets,
          which together with core collections, could be used for building up realistic workshops on ore exploration (on field
          experience). For more information of EUROCORE project please visit project website <a target="_blank" href="https://eitrawmaterials.eu/course/eurocore/">https://eitrawmaterials.eu/course/eurocore/</a>
        </p>
      </div>
    </div>

    <div class="row">
      <div class="col-sm-12" id="partners">
        <h3>Partnership</h3>
        <ul>
          <li>Université de Lorraine (UL), France (Lead Partner)</li>
          <li>Centre de Recherches sur la Géologie des Matières minerales et energetiques (CREGU), France</li>
          <li>Fraunhofer-Gesellschaft zur Förderung der angewandten Forschung e.V. (Fraunhofer), Germany</li>
          <li>Geologian tutkimuskeskus, GTK (Geological Survey of Finland), Finland</li>
          <li>Tallinna Tehnikaülikool, TTÜ – Tallinn University of Technology, Estonia</li>
          <li>Universidad Politecnica de Madrid, UPM (Technical University of Madrid), Spain</li>
        </ul>
        <div id="partners-logos">
          <a target="_blank" href="http://welcome.univ-lorraine.fr/en">
            <img v-b-tooltip.hover.bottom title="Université de Lorraine" src="http://www.eurocore.rocks/images/logos/Nancy_logo.png" alt="UL">
          </a>
          <a target="_blank" href="https://ttu.ee/geoloogia-instituut">
            <img v-b-tooltip.hover.bottom title="Tallinn University of Technology" src="http://www.eurocore.rocks/images/logos/TTU_logo.png" alt="TTÜ" >
          </a>
          <a target="_blank" href="http://www.upm.es/internacional">
            <img v-b-tooltip.hover.bottom title="Technical University of Madrid" src="http://www.eurocore.rocks/images/logos/Madrid_logo.png" alt="UPM">
          </a>
          <a target="_blank" href="http://en.gtk.fi/">
            <img v-b-tooltip.hover.bottom title="Geological Survey of Finland" src="http://www.eurocore.rocks/images/logos/GTK_logo.png" alt="GTK">
          </a>
          <a target="_blank" href="https://www.fraunhofer.de/en.html">
            <img v-b-tooltip.hover.bottom title="Fraunhofer" src="http://www.eurocore.rocks/images/logos/Fraunhofer_logo.png" alt="Fraunhofer">
          </a>
          <a target="_blank" href="http://georessources.univ-lorraine.fr/en">
            <img v-b-tooltip.hover.bottom title="CREGU" src="http://www.eurocore.rocks/images/logos/cregu_logo.png" alt="CREGU">
          </a>
        </div>

      </div>
    </div>
  </div>
</template>

<script>
    export default {
      name: "front-page",
      methods: {
        check: function () {
          $('#hi').tooltip('show');
        }
      }
    }
</script>

<style scoped>
  #front-page-image {
    width: 100%;
    margin: 0 0 15px;
  }

  h3 {
    color: #6bb745;
    font-weight: 600;
  }

  #partners {
    padding-bottom: 15px;
  }

  #partners-logos > a > img {
    height: 47px;
    margin-right: 12.5px;
    margin-left: 12.5px;
    border: 0;
  }

</style>