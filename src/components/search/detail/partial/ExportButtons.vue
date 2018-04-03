<template>
  <div>
    <b-dropdown text="EXPORT" variant="primary">

      <b-dropdown-item @click="exportToXLSX()">Export to XLSX</b-dropdown-item>

      <b-dropdown-item @click="exportToCSV()">Export to CSV</b-dropdown-item>

    </b-dropdown>
  </div>
</template>

<script>
  export default {
    props: ['filename', 'table-id'],
    name: "export-buttons",
    data() {
      return {
        table: this.tableId
      }
    },
    created: function () {
      if (typeof(this.table) === 'undefined') {
        this.table = 'table-search'
      }
    },
    methods: {

      exportToXLSX() {

        // TableExport(document.getElementsByTagName("table"), {
        //   headers: true,                              // (Boolean), display table headers (th or td elements) in the <thead>, (default: true)
        //   footers: true,                              // (Boolean), display table footers (th or td elements) in the <tfoot>, (default: false)
        //   formats: ['xlsx', 'csv', 'txt'],            // (String[]), filetype(s) for the export, (default: ['xlsx', 'csv', 'txt'])
        //   filename: 'id',                             // (id, String), filename for the downloaded file, (default: 'id')
        //   bootstrap: false,                           // (Boolean), style buttons using bootstrap, (default: true)
        //   exportButtons: true,                        // (Boolean), automatically generate the built-in export buttons for each of the specified formats (default: true)
        //   position: 'bottom',                         // (top, bottom), position of the caption element relative to table, (default: 'bottom')
        //   ignoreRows: null,                           // (Number, Number[]), row indices to exclude from the exported file(s) (default: null)
        //   ignoreCols: null,                           // (Number, Number[]), column indices to exclude from the exported file(s) (default: null)
        //   trimWhitespace: true                        // (Boolean), remove all leading/trailing newlines, spaces, and tabs from cell text in the exported file(s) (default: false)
        // });

        const table = $('table')

        let instance = new TableExport(table, {
          formats: ['xlsx'],
          exportButtons: false,
          filename: this.filename,
          trimWhiteSpace: true
        });

        let exportXLSXtable = instance.getExportData()[this.table]['xlsx'];

        for (let row in exportXLSXtable.data) {
          for (let cell in exportXLSXtable.data[row]) {
            // exportXLSXtable.data[row][cell].v = exportXLSXtable.data[row][cell].v.replace(/\s+/g, ' '); // Removes whitespace
            // BUG FIX: 03.04.2018 | Replacing dash in Kylylahti because of some Chrome issue not showing Kylylahti fields correctly in xlsx format.
            if (exportXLSXtable.data[row][cell].v.includes('Kylylahti KU-')) {
              exportXLSXtable.data[row][cell].v = exportXLSXtable.data[row][cell].v.replace('-', '');
            }
          }
        }

        instance.export2file(exportXLSXtable.data, exportXLSXtable.mimeType, exportXLSXtable.filename, exportXLSXtable.fileExtension)
      },

      exportToCSV() {
        const table = $('table')

        let instance = new TableExport(table, {
          formats: ['csv'],
          exportButtons: false,
          filename: this.filename,
          trimWhiteSpace: true
        });

        let exportCSVtable = instance.getExportData()[this.table]['csv'];

        instance.export2file(exportCSVtable.data, exportCSVtable.mimeType, exportCSVtable.filename, exportCSVtable.fileExtension)
      }
    }
  }
</script>

<style scoped>

</style>
