<template>
  <div>
    <div class="row">
      <div class="col">
        <img id="front-page-image" src="https://eurocore.rocks/images/loppi1.jpg"
             alt="Studying drillcores at the GTK's Loppi field station, Finland"/>
      </div>
    </div>

    <div class="row">
      <div class="col-md-12 col-lg-4">
        <h3>Data portal</h3>
        <p>
          EUROCORE data portal provides access to the detailed geological datasets collected from ore exploration drill
          cores.
          One can find traditional core logs as well as data collected with novel exploration techniques.
          The data portal allows user to search over wide range of information including geological descriptions, raw
          analytical data, image files, etc.
          Data tables and graphs could be exported to the external applications via common spreadsheet and vector
          graphic formats.
        </p>
      </div>
      <div class="col-md-12 col-lg-4">
        <h3>Partners and data providers</h3>
        <ul>
          <li><a href="http://welcome.univ-lorraine.fr/en" target="_blank">Lorraine University</a></li>
          <li><a href="http://georessources.univ-lorraine.fr/en" target="_blank">CREGU</a></li>
          <li><a href="https://www.fraunhofer.de/en.html" target="_blank">Fraunhofer-Gesellschaft</a></li>
          <li><a href="http://en.gtk.fi/" target="_blank">Geological Survey of Finland</a></li>
          <li><a href="https://ttu.ee/en/" target="_blank">Tallinn University of Technology</a></li>
          <li><a href="http://www.upm.es/internacional" target="_blank">Technical University of Madrid</a></li>
        </ul>
        <p>
          The Geological Survey of Finland and several mining companies act as the primary providers of drill core
          geological data.
          Data collected with in situ field devices are provided by Lorraine University and CT data by
          Fraunhofer-Gesellschaft.
        </p>
      </div>
      <div class="col-md-12 col-lg-4">
        <h3>Project</h3>
        <p>
          EUROCORE project funded by EIT Raw Materials wants to assist the mining industry in the formation of students
          and mining
          company personnel on the use of innovative in situ technologies for exploration. EUROCORE data portal aims to
          provide
          teaching aid for geological master courses by delivering exploration datasets, which together with core
          collections,
          could be used for building up realistic workshops on ore exploration. For more information about the project
          please visit
          <a target="_blank" href="https://eitrawmaterials.eu/course/eurocore/">https://eitrawmaterials.eu/course/eurocore/</a>
        </p>
      </div>
    </div>

    <div class="row mt-3">
      <div class="col" id="partners">
        <div id="partners-logos">
          <a target="_blank" href="http://welcome.univ-lorraine.fr/en">
            <img v-b-tooltip.hover.bottom title="Université de Lorraine"
                 src="https://eurocore.rocks/images/logos/Nancy_logo.png" alt="UL">
          </a>
          <a target="_blank" href="https://ttu.ee/geoloogia-instituut">
            <img v-b-tooltip.hover.bottom title="Tallinn University of Technology"
                 src="https://eurocore.rocks/images/logos/TTU_logo.png" alt="TTÜ" id="ttu-logo">
          </a>
          <a target="_blank" href="http://www.upm.es/internacional">
            <img v-b-tooltip.hover.bottom title="Technical University of Madrid"
                 src="https://eurocore.rocks/images/logos/Madrid_logo.png" alt="UPM">
          </a>
          <a target="_blank" href="http://en.gtk.fi/">
            <img v-b-tooltip.hover.bottom title="Geological Survey of Finland"
                 src="https://eurocore.rocks/images/logos/GTK_logo.png" alt="GTK">
          </a>
          <a target="_blank" href="https://www.fraunhofer.de/en.html">
            <img v-b-tooltip.hover.bottom title="Fraunhofer"
                 src="https://eurocore.rocks/images/logos/Fraunhofer_logo.png" alt="Fraunhofer" id="fraunhofer-logo">
          </a>
          <a target="_blank" href="http://georessources.univ-lorraine.fr/en">
            <img v-b-tooltip.hover.bottom title="CREGU" src="https://eurocore.rocks/images/logos/cregu_logo.png"
                 alt="CREGU">
          </a>
        </div>

      </div>
    </div>
  </div>
</template>

<script>
  export default {
    name: "front-page",
    metaInfo: {
      title: 'EUROCORE Data Portal'
    },
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

  ul {
    margin-bottom: 0.5rem;
    list-style-type: circle;
  }

  #partners {
    padding-bottom: 1.5rem;
    text-align: center;
  }

  #partners-logos > a > img {
    height: 47px;
    margin-right: 12.5px;
    margin-left: 12.5px;
    border: 0;
  }

  #fraunhofer-logo {
    height: 40px !important;
  }

  #ttu-logo {
    height: 40px !important;
  }

</style>
