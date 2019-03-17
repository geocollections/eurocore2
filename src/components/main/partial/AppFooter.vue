<template>
  <footer class="footer">
    <div>
      <a target="_blank" href="https://eitrawmaterials.eu" title="EIT RawMaterials">
        <img id="eitrawLogo" src="https://eurocore.rocks/images/RM-Academy-Logo_300px.png" alt="Eitraw logo"/>
      </a>
      <a target="_blank" href="https://eitrawmaterials.eu" title="EU">
        <img id="euLogo" src="https://eurocore.rocks/images/EU-Flag-2020_100px.png" alt="EU"/>
      </a>
    </div>

    <div><font-awesome-icon :icon="icon" /> 2017-2019. EIT RawMaterials project EUROCORE: European Core Sample Collection for Master Training.</div>

    <div>
      <a target="_blank" href="http://ttu.ee/geoloogia-instituut">Developed and hosted by the Department of Geology, Tallinn University of Technology</a> and <a target="_blank" href="http://natarc.ut.ee">NATARC</a>.
    </div>
  </footer>
</template>

<script>
  import FontAwesomeIcon from '@fortawesome/vue-fontawesome'
  import faCreativeCommons from '@fortawesome/fontawesome-free-brands/faCreativeCommons'

  export default {
    components: {
      FontAwesomeIcon
    },
    name: "app-footer",
    computed: {
      icon() {
        return faCreativeCommons
      }
    }
  }
</script>

<style scoped>
  .footer {
    /*position: absolute;*/
    /*bottom: 0;*/
    /*width: 100%;*/
    font-size: 0.7rem;
    padding: 5px 15px 15px;
    text-align: center;
    background-color: #FFFFFF;
    border-top: 2px solid rgba(0, 68, 148, .1);
    color: #333;
    opacity: 0.9;
  }

  #eitrawLogo {
    height: 50px;
    margin: 10px;
  }
  #euLogo {
	    height: 50px;
	    margin: 10px;
	  }
  /* Footer logo is 40px for small mobile screens */
  @media (max-width: 515px) {
    #eitrawLogo {
      height: 40px;
    }

    #euLogo {
      height: 34px;
    }
  }

</style>
