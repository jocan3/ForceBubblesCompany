d3.csv('data/intel.csv', function (error, data) {























































		var allData = data;
		var dataEntered = data;
		var dataRemoved = data;
		
		var nodeRadius=2.5;
	  
        var width = 600, height = 450;
        var fill = d3.scale.ordinal().range(['#827d92','#827354','#523536','#72856a','#2a3285','#383435'])
        var svg = d3.select("#chart").append("svg")
            .attr("width", width)
            .attr("height", height);

        for (var j = 0; j < data.length; j++) {
          data[j].radius = nodeRadius;
          data[j].x = Math.random() * width;
          data[j].y = Math.random() * height;
		  data[j].Identifier = data[j]['ID'];
        }

        var padding = 4;
        var maxRadius = d3.max(_.pluck(data, 'radius'));
		
		var centersAge = [];
		var centersAgeCount = 0;
		
		var getCenterAge = function (center){
			var age = centersAgeCount;
			var found = false;
			for (var i = 0; i < centersAgeCount && !found; ++i){
				if (centersAge[i] == center){
					found = true;
					age = i;
				}
			}
			if (!found){
				centersAge[centersAgeCount] = center;
				centersAgeCount++;
			}
		
			return age;
		}

        var getCenters = function (varname, size) {
          var centers, map;
          centers = _.uniq(_.pluck(data, varname+'_BizGroup')).map(function (d) {
            return {name: d, value: (getCenterAge(d))+4, r: 1000};
          });
		  
		  
		  
		  console.log(centers);

          map = d3.layout.pack().size(size);
		  map.padding(1000);
		  map.sort();
		  
		  //map = d3.layout.treemap().size(size).ratio(1/1);
          //map.sort();
		  //map.padding(30);
		  
		  map.nodes({children: centers});
		  
		  return centers;
        };
		
		filterData('A2006_10');
		
        var nodes = svg.selectAll("circle")
          .data(data,function(d) { return d.Identifier; });

		nodes.transition().duration(1000)
          .attr("r", function (d) { return d.radius; })

        var force = d3.layout.force();

        draw('A2006_10');

		/*
        $( ".btn" ).click(function() {
		  
          draw(this.id);
        });*/
		
		$( "#back" ).click(function() {
		    var year = document.getElementById('years');
			var month = document.getElementById('months');
		
			if (month.value == '1'){
				if (year.value != '2006'){
					year.value = ''+(parseInt(year.value) - 1);
					month.value = '12';
				}
			}else{
				month.value = ''+(parseInt(month.value) - 1);
			}
			
			outputUpdateYear(year.value);
			outputUpdateMonth(month.value);
			//$( "#years" ).trigger("change");
			$( "#months" ).trigger("change");
			
        });
		
		$( "#next" ).click(function() {
		    var year = document.getElementById('years');
			var month = document.getElementById('months');
		
			if (month.value == '12'){
				if (year.value != '2015'){
					year.value = ''+(parseInt(year.value) + 1);
					month.value = '1';
				}
			}else{
				month.value = ''+(parseInt(month.value) + 1);
			}
			
			outputUpdateYear(year.value);
			outputUpdateMonth(month.value);
			//$( "#years" ).trigger("change");
			$( "#months" ).trigger("change");
			
        });
		
		$("#years").on("change", function() { 
			var year = document.getElementById('years');
			var month = document.getElementById('months');
			draw('A'+year.value + '_' + month.value);
		});
		
		$("#months").on("change", function() { 
			var year = document.getElementById('years');
			var month = document.getElementById('months');
			draw('A'+year.value + '_' + month.value);
		});
		
		/*function callDraw(){
			var year = document.getElementById('years');
			var month = document.getElementById('months');
			draw(year.value + '-' + month.value);
		};*/

        function draw (varname) {
		  filterData(varname);
          var centers = getCenters(varname, [600, 400]);
          force.on("tick", tick(centers, varname));
          labels(centers)
          force.start();
        }

        function tick (centers, varname) {
          var foci = {};
          for (var i = 0; i < centers.length; i++) {
            foci[centers[i].name] = centers[i];
          }
		  
		  for (var j = 0; j < data.length; j++) {
			  data[j].radius = nodeRadius;
		  }

		  var beforeAdd = 0;
		  
		  nodes = svg.selectAll("circle")
          .data(data, function(d){return d.Identifier;});		
			
		  //nodes.attr("class", function (d){++beforeAdd; return "update";});		  
		   nodes.style("fill", function (d) { return fill(d[varname+'_BizGroup']); })
		
		console.log('beforeAdd');
			console.log(beforeAdd);
		
			var afterAdd = 0;
		nodes.enter().append("circle")
          .attr("class", function (d){afterAdd++; return "enter";})
          .attr("cx", function (d) { return d.x; })//{ d.x = Math.random() * width; return d.x; })
          .attr("cy", function (d) { return d.y; })//{ d.y = Math.random() * height; return d.y; })
          .attr("r", function (d) { return d.radius; })		  
          .on("mouseover", function (d) { showPopover.call(this, d); })
          .on("mouseout", function (d) { removePopovers(); });
		  
		  
		  console.log('AfterAdd');
			console.log(afterAdd);
		  
		 //.style("fill", '#FFB607');
		  
		  var beforeRemove = 0;
		  
		   nodes.exit()
		   .attr("class", function (d){++beforeRemove; return "update";})	
		   .remove();
		 // console.log(nodesEnter);
		  
		  
		console.log('beforeRemove');
			console.log(beforeRemove);
		
		  
	
		  
          return function (e) {
            for (var i = 0; i < data.length; i++) {
              var o = data[i];
              var f = foci[o[varname+'_BizGroup']];
              o.y += (f.y - o.y) * e.alpha;
              o.x += (f.x - o.x) * e.alpha;
			  //o.y += ((f.y + (f.dy / 2)) - o.y) * e.alpha;
			  //o.x += ((f.x + (f.dx / 2)) - o.x) * e.alpha;
            }
            nodes.each(collide(.11))
              .attr("cx", function (d) { return d.x; })
              .attr("cy", function (d) { return d.y; });
          }
        }

        function labels (centers) {
          svg.selectAll(".label").remove();

          svg.selectAll(".label")
          .data(centers).enter().append("text")
          .attr("class", "label")
		  .attr("fill", "white")
          .text(function (d) { if (d==undefined){return "blank";}
								else{return d.name;}
								 })
          .attr("transform", function (d) {
			var nm = (d.name == undefined) ? "blank" : d.name; 
            //return "translate(" + (d.x + (d.dx / 2)) + ", " + (d.y + 20) + ")";
			return "translate(" + (d.x - ((nm.length)*3)) + ", " + (d.y - d.r) + ")";
          });
        }

        function removePopovers () {
          /*$('.popover').each(function() {
            $(this).remove();
          });*/ 
        }

        function showPopover (d) {
          /*$(this).popover({
            placement: 'auto top',
            container: 'body',
            trigger: 'manual',
            html : true,
            content: function() { 
              return "Make: " + d.make + "<br/>Model: " + d.model + "<br/>Drive: " + d.drive +
                     "<br/>Trans: " + d.trans + "<br/>MPG: " + d.comb; }
          });
          $(this).popover('show')*/
        }
		
		function filterData(varname){			
			data = allData.filter(function(d, i) 
			{ 
				if (d[varname+'_BizGroup'] != '' && d[varname+'_BizGroup'] != undefined) 
				{ 
					return d; 
				} 

			})
		}

        function collide(alpha) {
          var quadtree = d3.geom.quadtree(data);
          return function(d) {
            var r = d.radius + maxRadius + padding,
                nx1 = d.x - r,
                nx2 = d.x + r,
                ny1 = d.y - r,
                ny2 = d.y + r;
            quadtree.visit(function(quad, x1, y1, x2, y2) {
              if (quad.point && (quad.point !== d)) {
                var x = d.x - quad.point.x,
                    y = d.y - quad.point.y,
                    l = Math.sqrt(x * x + y * y),
                    r = d.radius + quad.point.radius + padding;
                if (l < r) {
                  l = (l - r) / l * alpha;
                  d.x -= x *= l;
                  d.y -= y *= l;
                  quad.point.x += x;
                  quad.point.y += y;
                }
              }
              return x1 > nx2 || x2 < nx1 || y1 > ny2 || y2 < ny1;
            });
          };
        }
      });









































































