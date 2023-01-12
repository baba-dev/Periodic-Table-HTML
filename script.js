Vue.component('social-networks', {
  template: "#social-networks",
	props: ["show"],
  data() {
    return {
      popupa: null
    }
  },
  methods: {
    openPopup: function(link) {
      this.popup.window = window.open(
        link,
        'sharer',
        'status=no,height=' + this.popup.height +
        ',width=' + this.popup.width +
        ',resizable=no,left=' + this.popup.left +
        ',top=' + this.popup.top +
        ',screenX=' + this.popup.left +
        ',screenY=' + this.popup.top + ',toolbar=no,menubar=no,scrollbars=no,location=no,directories=no'
      );
    }
  },
  computed: {
    popup: function() {
      var popup = {};
      popup.height = 500;
      popup.width = 500;

      popup.top = window.outerHeight / 2 + window.screenY - (popup.height / 2)
      popup.left = window.outerWidth / 2 + window.screenX - (popup.width / 2)
 
      popup.window = null;
      return popup;
    },
    networks: function() {
      var url = 'https://codepen.io/khr2003/full/ZVyqrL';
      var title = 'Periodic table';
      var desc = 'Interactive Peroidoic Table';
			var text = desc;
			var email_text = 'Hi, \r\n Check this awesome periodic table ' +url;
			var provider ='';
			
			// Twitter and tumblr
			var hash_tags = 'periodic_table';
			var user_id = '';
			
      var networkArray = [{

          link: `https://www.facebook.com/sharer/sharer.php?u=${url}`,
          icon: "socicon-facebook",
          type: "popup",
					color: "#3b5999"
        },
        {
          link: `https://plus.google.com/share?url=${url}`,
          icon: "socicon-googleplus",
          type: "popup",
					color: "#dd4b39"
        },
        {
          link: `https://reddit.com/submit?url=${url}&title=${title}`,
          icon: "socicon-reddit",
          type: "popup",
					color: "#ff5700"
        },
        {
          link: `https://twitter.com/intent/tweet?url=${url}&text=${title}&hashtags=${hash_tags}
`,
          icon: "socicon-twitter",
          type: "popup",
					color: "#55acee"
        },
        {
          link: `https://www.linkedin.com/shareArticle?mini=true&url=${url}&title=${title}&summary=${text}&source=${provider}`,
          icon: "socicon-linkedin",
          type: "popup",
					color: "#0077B5"
        },
        {
          link: `http://pinterest.com/pin/create/link/?url=${url}`,
          icon: "socicon-pinterest",
          type: "popup",
					color: "#bd081c"
        },
        {
          link: `https://www.tumblr.com/widgets/share/tool?canonicalUrl=${url}&title=${title}&caption=${text}&tags=${hash_tags}`,
          icon: "socicon-tumblr",
          type: "popup",
					color: "#34465d"
        },
        {
          link: `https://www.blogger.com/blog-this.g?u=${url}&n=${title}&t=${text}`,
          icon: "socicon-blogger",
          type: "popup",
					color: "#f57d00"
        },
        {
          link: `https://mail.google.com/mail/?view=cm&to=&su=${title}&body=${email_text}`,
          icon: "socicon-mail",
          type: "popup",
					color: "#c71610"
        },
        {
          link: `mailto:?subject=${title}&body=${text}`,
          icon: "socicon-mailru",
          type: "popup",
					color: "#21759b"
        }
      ];

      return networkArray;
    }
  }
});


new Vue({
    el: '#main',
    data() {
        return {
            elements: [],
            viewElement: -1,
            searchMode: false,
            searchText: "",
            showShare: false,
            showInfo: false,
            showCategory: null,
            lanthanide: false,
            actinide: false
        }
    },
    methods: {
        showElement: function (index, event) {
            var element = this.elements[index];
            var block = event.target;

            // Get some boolean values
            var isBlank = element.category == "blank";
            var islanthanide = this.classContains(block, 'lanthanide blank');
            var isactinide = this.classContains(block, 'actinide blank');

            // Check if either lanthanide or actinide blank blocks are clicks
            if (islanthanide)
                this.lanthanide = true;

            if (isactinide)
                this.actinide = true;

            // Remove elements after 800ms (the time is require for the shaking animation)
            if (this.lanthanide || this.actinide) {
                setTimeout(() => {
                    this.actinide = false;
                    this.lanthanide = false;
                }, 800);
            }
            this.viewElement = (isBlank) ? -1 : index;
            this.showShare = false;
            this.showInfo = false;
        },
        classContains: function (element, classes) {
            /* Check if element has class*/
            classes = classes.split(" ");
            var results = true;
            classes.forEach(c => {
                contains = element.classList.contains(c);

                if (contains == false)
                    results = false;
            });

            return results;
        },
        searchElements: function (e) {
            // Get search text and convert to lowercase fo case insenstive search
            this.searchText = e.target.value.toLowerCase();

            this.elements.forEach(element => {
                // search in name and symbole. Make lowercase to search case-insenstive
                var name = element.name.toLowerCase();
                var symbol = element.name.toLowerCase();
                var findName = name.search(this.searchText);
                var findSymbol = symbol.search(this.searchText);

                element.search = (findName != -1 || findSymbol != -1) ? true : false;
                //console.log(element, element.id);
                element.id = element.id + Date.now();

            });
        },
        elementClass: function (element, index) {
            var classes = [];
            var name = element.name.toLowerCase();
            var category = element.categoryClean;

            classes.push("single-element");
            classes.push(name);
            classes.push(category);

            // if clicked then highlight clicked element
            if (this.viewElement == index)
                classes.push("clicked");

            // If user hovers over categories in legend then highlight relevant elements
            if (this.showCategory == element.categoryClean)
                classes.push("highlight-category");

            // If either lanthanide or actinide blank blocks are clicked then shake the relevant blocks
            if (this.lanthanide == true && category == "lanthanide" && name != "blank")
                classes.push("shake");

            if (this.actinide == true && category == "actinide" && name != "blank")
                classes.push("shake");


            if (this.searchMode == true) {
                var highlight = (element.search == true) ? "highlight" : "unhighight";
                classes.push(highlight);
            }
            return classes;
        },
        convertTemp: function(k){
            if(k == null)
                return null;
            
            var c = (k -  273.15).toFixed(2);
            var f = (c * 9/5 + 32).toFixed(2);
            return `${k}k = ${c}c = ${f}f`;
        }
    },
    computed: {
        getPhaseIcon: function () {
            var states = {
                "solid": "data:image/svg+xml;base64," + btoa('<svg height="24px" width="24px" fill="rgba(0,0,0,0.5)" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" version="1.1" x="0px" y="0px" viewBox="0 0 58 52" enable-background="new 0 0 58 52" xml:space="preserve"><path d="M19.417,17.596l7.597,3.497c0.999,0.46,2.634,0.46,3.632,0l6.411-2.951l10.514-5.014c-0.221-0.166-0.447-0.315-0.686-0.424  L31.559,5.647c-1.498-0.69-3.951-0.69-5.45,0l-15.331,7.057c-0.245,0.112-0.477,0.267-0.703,0.438L19.417,17.596L19.417,17.596z"></path><path d="M28.098,24.693c0-1.102-0.817-2.376-1.816-2.837L14.71,16.532c-0.01-0.004-0.018-0.012-0.028-0.017L9.45,14.104v17.992  c0,1.65,1.227,3.564,2.726,4.255l15.331,7.058c0.136,0.063,0.288,0.113,0.438,0.164l0.152-9.367V24.693z"></path><path d="M42.465,16.466c-0.021,0.011-0.039,0.026-0.062,0.037l-11.574,5.327c-1,0.459-1.816,1.736-1.816,2.836v7.836l0.023-0.001  L29,43.608c0.216-0.065,0.421-0.142,0.61-0.229l15.33-7.058c1.498-0.69,2.726-2.604,2.726-4.255l-0.003-17.999L42.465,16.466z"></path></svg>'),
                "gas": "data:image/svg+xml;base64," + btoa('<svg height="25px" width="25px"  fill="rgba(0,0,0,0.8)" xmlns="http://www.w3.org/2000/svg" data-name="Layer 1" viewBox="0 0 100 100" x="0px" y="0px"><title>Lab</title><path d="M84.07,86.68l-18.66-32a19.67,19.67,0,0,1-2.17-8V31.91h2a1.67,1.67,0,0,0,1.66-1.66V28.59a1.67,1.67,0,0,0-1.66-1.67H35.31a1.67,1.67,0,0,0-1.66,1.67v1.66a1.67,1.67,0,0,0,1.66,1.66h1.45V46.62a19.67,19.67,0,0,1-2.17,8l-18.66,32A6.29,6.29,0,0,0,15,89.86a4.68,4.68,0,0,0,1.74,3.66,6,6,0,0,0,3.82,1.21H79.44a6,6,0,0,0,3.82-1.21A4.65,4.65,0,0,0,85,89.86,6.29,6.29,0,0,0,84.07,86.68ZM38.9,57.16a24.12,24.12,0,0,0,2.85-10.54V31.91h16.5V46.62A24.12,24.12,0,0,0,61.1,57.16l5.62,9.64H33.28ZM79.44,89.75H20.56a2,2,0,0,1-.54-.06h0a1.76,1.76,0,0,1,.22-.5L30.38,71.78H69.62L79.76,89.19a2,2,0,0,1,.23.51A2.83,2.83,0,0,1,79.44,89.75Z"></path><circle cx="43.52" cy="11.61" r="6.34" transform="translate(-1.5 10.31) rotate(-13.28)"></circle><circle cx="58.05" cy="17.02" r="4.46" transform="translate(-1.98 9.52) rotate(-9.22)"></circle><path d="M45.6,57.63a2.86,2.86,0,1,0,2.86,2.86A2.86,2.86,0,0,0,45.6,57.63Z"></path><circle cx="51.93" cy="51.35" r="3.48"></circle><path d="M48.35,43.19a2.59,2.59,0,1,0-2.58-2.58A2.58,2.58,0,0,0,48.35,43.19Z"></path></svg>'),

                "liquid": "data:image/svg+xml;base64," + btoa('<svg height="25px" width="25px"  fill="rbga(0,0,0,0.7" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" version="1.1" x="0px" y="0px" viewBox="0 0 1000 1000" style="enable-background:new 0 0 1000 1000;" xml:space="preserve"><g><path d="M818.2,714.7c-2.2-46.9-23.3-92.8-63-141.9c11.4-28,16.3-57.7,14.7-89.7c-2.3-48.3-24.5-95.6-66.6-146.3   c-4.6-5.6-9.3-11.2-13.9-16.8c-31.9-39.8-54.4-78.3-67.8-114c-13.3-35.7-23.3-83.7-27.6-144.3c-20.7,57-39.4,103.1-58.3,137.5   c-18.9,34.4-45.8,71.9-80.1,114c-4.9,6-9.9,12-14.8,18c-2.9,3.6-5.7,7.3-8.5,10.9c-2.7-6-5.1-11.9-7.3-17.8   c-13.3-35.7-23.3-83.7-27.6-144.3c-20.7,57-39.4,103.1-58.3,137.5c-18.9,34.4-45.8,71.9-80.1,114c-4.9,6-9.8,12-14.7,18   c-44.4,54.9-65.2,113.4-62.4,170.7c3,63.4,27.3,116.5,70.6,156.2c36,33,75.8,48.6,118.5,48.6c8.7,0,17.6-0.7,26.6-1.9   c16.1-2.3,31.2-6.4,45.4-12.1c11.9,30.1,30.2,56.5,54.4,78.8c36,33,75.8,48.6,118.5,48.6c8.7,0,17.6-0.7,26.6-1.9   c53.3-7.6,95.7-34.6,129.5-78C805.7,814.7,820.7,768,818.2,714.7z M463.3,349.5c4.7-5.8,9.6-11.8,14.6-17.8l0.1-0.1l0.1-0.1   c37.1-45.4,64.3-84.1,83.1-118.3c6.6-11.9,13.2-25.3,20.1-40.6c3.8,15.7,8.3,30.2,13.3,43.6c10.4,27.8,25.5,56.3,45,85   c1-2.6,1.9-5.3,2.9-8c0.3,4.7,0.7,9.2,1.1,13.8c7.2,10.3,15,20.7,23.3,31.1l0.1,0.2c4.1,5.1,8.6,10.5,14,17   c19.8,23.9,34.2,46,44.2,67.7c9.7,21,14.8,41.1,15.8,61.5c1.1,22.2-1.3,42.5-7.2,62.1c-0.3,1-0.6,2-1,3.1   c-3,9.4-6.9,18.5-11.6,27.5c-5.6,10.7-12.4,21.2-20.5,31.7c-30.2,38.8-66.4,60.8-110.8,67.1c-7.6,1.1-15.2,1.6-22.5,1.6   c-1.3,0-2.7,0-4-0.1c7.9-24,11.1-49.3,9.8-76.2c-1.2-24.6-7.5-49-19.1-73.7c-4.3-9.3-9.4-18.6-15.2-28c-9-14.6-19.8-29.5-32.3-44.6   c-4.6-5.6-9.3-11.2-13.9-16.8c-18.3-22.8-33.5-45.2-45.7-66.9C452.1,364,457.5,356.7,463.3,349.5z M433.9,783.2   c-12.7,5.4-26.2,9.1-40.6,11.1c-7.6,1.1-15.2,1.6-22.5,1.6c-36.5,0-68.9-13.4-98.9-41c-38-34.8-58.6-80.6-61.2-136.2   c-1.2-24.8,2.8-50.1,11.8-75c9.4-25.8,24.3-51.5,44.2-76.1c4.7-5.8,9.6-11.8,14.6-17.8l0.1-0.2c37.1-45.4,64.3-84.1,83.1-118.3   c6.6-11.9,13.2-25.3,20.1-40.6c3.8,15.7,8.3,30.2,13.3,43.6c4.4,11.8,9.7,23.6,15.7,35.6c5,9.9,10.5,19.8,16.6,29.8   c11.4,18.7,24.7,37.6,39.9,56.5l0.1,0.1l0.1,0.1c4.1,5.1,8.6,10.5,14,17c14.7,17.8,26.5,34.6,35.7,51c3.1,5.6,6,11.2,8.5,16.7   c1.9,4.2,3.7,8.4,5.3,12.5c6.3,16.6,9.8,32.7,10.5,49c1.1,23.3-1.5,44.6-8.2,65.1c-0.6,1.9-1.3,3.8-2,5.7   c-3.3,9.1-7.3,17.9-12.2,26.7c-5.1,9-11,17.9-17.9,26.8c-13.4,17.2-27.9,31.1-43.8,41.7C451.9,774.6,443.1,779.3,433.9,783.2z    M781.1,781.2c-6.7,20.6-17.1,40-32.1,59.2c-30.2,38.8-66.4,60.8-110.7,67.2c-7.6,1.1-15.2,1.6-22.5,1.6c-36.5,0-68.8-13.4-98.9-41   c-21.7-19.9-37.8-43.5-48-70.4c21.8-13.2,41.1-30.9,58.2-52.9c9.9-12.7,18.1-25.7,24.8-39c5.2,0.5,10.4,0.7,15.7,0.7   c8.7,0,17.6-0.6,26.6-1.9c53.3-7.6,95.7-34.6,129.5-78c6.4-8.3,12.2-16.7,17.3-25.2c14,18.4,24.7,35.9,32.6,53.1   c9.7,21,14.8,41.1,15.8,61.5C790.4,739.4,787.7,760.7,781.1,781.2z"></path><path d="M642.4,293.3c-1,2.7-1.9,5.3-2.9,8c1.3,1.9,2.6,3.9,4,5.8C643,302.6,642.7,298,642.4,293.3z"></path><path d="M642.4,293.3c-1,2.7-1.9,5.3-2.9,8c1.3,1.9,2.6,3.9,4,5.8C643,302.6,642.7,298,642.4,293.3z"></path></g></svg>')
            }
            if (this.viewElement != -1) {
                var element = this.elements[this.viewElement];
                return states[element.phase.toLowerCase()];
            }
            return "";
        },
        categories: function () {
            var categories = [];
            var temp = [];
            this.elements.filter(element => {
                var category = element.category;
                var categoryClean = element.categoryClean;
                if (temp.indexOf(category) == -1 && category != "blank") {
                    temp.push(category);
                    categories.push({
                        "category": category,
                        categoryClean: categoryClean
                    });
                }
            });
            return categories;
        },
        currentElement: function () {
            var current = (this.viewElement == -1) ? {} : this.elements[this.viewElement];
            return current;
        },
        overview: function () {
            var currentElement = this.currentElement;

            var overview = [{
                    icon: "",
                    text: "Classfication",
                    value: currentElement.category
        }, {
                    icon: "",
                    text: "Color",
                    value: currentElement.appearance
        }, {
                    icon: "",
                    text: "State",
                    value: currentElement.phase
        }, {
                    icon: "",
                    text: "Density",
                    value: currentElement.density + " g/L"
        },
                {
                    icon: "",
                    text: "Melting Point",
                    value: this.convertTemp(currentElement.melt)
        },
                {
                    icon: "",
                    text: "Boiling Point",
                    value: this.convertTemp(currentElement.boil)
        },
                {
                    icon: "",
                    text: "Atomic Mass",
                    value: currentElement.atomic_mass
        },
                {
                    icon: "",
                    text: "Discovered by",
                    value: currentElement.discovered_by
        },
                {
                    icon: "",
                    text: "Named By",
                    value: currentElement.named_by
        }
      ];
            return overview;
        }
    },
    watch: {
        elements: {
            handler: function (newValue) {},
            deep: true
        },
        searchMode: function(value){
            if(value)
                this.$refs.searchInput.focus();
        },
    },
    mounted() {
        axios.get('https://raw.githubusercontent.com/Bowserinator/Periodic-Table-JSON/master/PeriodicTableJSON.json')
            .then(response => {
                var elements = response.data.elements;
                /* Once we get a repsonse then we modify the array to include blank elements
        first Extract reactive metal elements to be added later to the end of the array. They will be displayed under the main table
*/
                var reactiveFirst = elements.splice(56, 15);
                var reactiveSecond = elements.splice(73, 15);

                // Add search and cleancategory properties
                reactiveFirst.map(element => {
                    element.search = false;
                    element.categoryClean = element.category;
                });


                reactiveSecond.map(element => {
                    element.search = false;
                    element.categoryClean = element.category;
                });


                // Create blank object and loop through elements to organize elements array
                var blankObj = {
                    "name": "blank",
                    "category": "blank"
                };

                // Remove last elemenet as it is currently a placeholder
                elements.pop();

                // Add reactive elements with required blanks
                var blanks = [];
                for (var i = 0; i < 4; i++) {
                    blanks.push({
                        "name": "blank",
                        "category": "blank"
                    });
                }
                elements = elements.concat(blanks);

                // push first row 
                elements = elements.concat(reactiveFirst);

                // More blanks
             var blanks = [];
                for (var i = 0; i < 3; i++) {
                    blanks.push({
                        "name": "blank",
                        "category": "blank"
                    });
                }
            
                elements = elements.concat(blanks);

                // Second row
                elements = elements.concat(reactiveSecond);
                for (var i = 0; i < elements.length; i++) {
                //elements.forEach((element, i, elementsArray) => {
                    // We need three blank elements when we get 0
                    if (i == 0) {
                        elements.splice(i + 1, 0, {
                            "name": "blank",
                            "category": "blank"
                        });
                        elements.splice(i + 1, 0, {
                            "name": "blank",
                            "category": "blank"
                        });
                        elements.splice(i + 1, 0, {
                            "name": "blank",
                            "category": "blank"
                        });
                    }

                    // Elements 58 and 76 are blanks representing actinide and lanthanide respectivly, we need to add click event to highlight the categories
                    if (i == 58)
                        elements.splice(i + 1, 0, {
                            name: "lanthanide",
                            category: "blank"
                        });

                    if (i == 76)
                        elements.splice(i + 1, 0, {
                            name: "actinide",
                            category: "blank"
                        });
                    
                    // Also add new properties
                    element = elements[i];
                    element.search = false;
                    element.id = i;
                   
                    // Fix categories
                    elements[i].category = element.category.replace("unknown, probably ", "").replace("unknown, predicted to be ", "");

                    elements[i].categoryClean = element.category.replace(/ /g, "-");
                }


                // Finally assign elment
                this.elements = elements;
            });
    }
})