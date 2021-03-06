import React, {Component} from 'react';
import { select } from 'd3-selection';
import { arc } from 'd3-shape';


class PointerGauge extends Component {
  constructor(props) {
    super(props)
    this.drawGauge = this.drawGauge.bind(this)
  }

  componentDidMount() {
    this.drawGauge(this.props.name, this.props.value, this.props.gaugeLowerBound, this.props.gaugeUpperBound, this.props.gaugeMaxValue, this.props.firstArc, this.props.secondArc, this.props.thirdArc)
  }

  componentDidUpdate() {
    this.drawGauge(this.props.name, this.props.value, this.props.gaugeLowerBound, this.props.gaugeUpperBound, this.props.gaugeMaxValue, this.props.firstArc, this.props.secondArc, this.props.thirdArc)
  }

  drawGauge(name, value, gaugeLowerBound, gaugeUpperBound, gaugeMaxValue, firstArc, secondArc, thirdArc) {

    const node = this.node

    // Set up variables
    let percentValue = value / gaugeMaxValue;

    let arcFirst = gaugeLowerBound / gaugeMaxValue;
    let arcSecond = (gaugeUpperBound - gaugeLowerBound) / gaugeMaxValue;
    let arcThird = (gaugeMaxValue - gaugeUpperBound) / gaugeMaxValue;

    (function() {

    let barWidth, chart, chartInset, degToRad, repaintGauge, height, margin, padRad, percToDeg, percToRad, percent, radius, totalPercent, width, arc1, arc2, arc3, perc, arcStartRad, arcEndRad;

    percent = percentValue;

    padRad = 0.025;
    chartInset = 30;

    totalPercent = .75;

    margin = {
      top: 20,
      right: 20,
      bottom: 30,
      left: 20
    };

    width = 300;
    height = width;
    radius = Math.min(width, height) / 2;
    barWidth = 40 * width / 300;

    // Utility methods
    percToDeg = function(perc) {
      return perc * 360;
    };

    percToRad = function(perc) {
      return degToRad(percToDeg(perc));
    };

    degToRad = function(deg) {
      return deg * Math.PI / 180;
    };

    // Selects SVG, appends group, and assigns it to chart variable

    chart = select(node)
      .append('g')
      .attr('transform', "translate(" + ((width + margin.left) / 2) + ", " + ((height + margin.top) / 2) + ")");

    // Appends arc to group
    chart.append('path').attr('class', "arc " + firstArc);
    chart.append('path').attr('class', "arc " + secondArc);
    chart.append('path').attr('class', "arc " + thirdArc);

    arc3 = arc().outerRadius(radius - chartInset).innerRadius(radius - chartInset - barWidth)
    arc2 = arc().outerRadius(radius - chartInset).innerRadius(radius - chartInset - barWidth)
    arc1 = arc().outerRadius(radius - chartInset).innerRadius(radius - chartInset - barWidth)

    // Set arc start and end points
    repaintGauge = function ()
    {
      perc = 0.5;
      var next_start = totalPercent;
      arcStartRad = percToRad(next_start);
      arcEndRad = arcStartRad + percToRad(perc * arcFirst);
      next_start += perc * arcFirst;


      arc1.startAngle(arcStartRad).endAngle(arcEndRad);

      arcStartRad = percToRad(next_start);
      arcEndRad = arcStartRad + percToRad(perc * arcSecond);
      next_start += perc * arcSecond;

      arc2.startAngle(arcStartRad + padRad).endAngle(arcEndRad);

      arcStartRad = percToRad(next_start);
      arcEndRad = arcStartRad + percToRad(perc * arcThird);

      arc3.startAngle(arcStartRad + padRad).endAngle(arcEndRad);

      chart.select("." + firstArc).attr('d', arc1);
      chart.select("." + secondArc).attr('d', arc2);
      chart.select("." + thirdArc).attr('d', arc3);
      }

      // Add labels
      var valueLabel = value.toFixed(0)
      var dataset = [{metric:name, value: valueLabel}]

      var texts =  chart.selectAll("text")
                  .data(dataset)
                  .enter();

          texts.append("text")
           .text(function(){
                return dataset[0].value;
           })
           .attr('id', "Value")
           .attr('transform', "translate(" + 0 + ", " + 40 + ")")
           .attr("font-size",25)
           .style("fill", "#000000");

      texts.append("text")
         .text(function(){
             return 0;
         })
         .attr('id', 'scale0')
         .attr('transform', "translate(" + -150 + ", " + 0 + ")")
         .attr("font-size", 15)
         .style("fill", "#000000");

      texts.append("text")
         .text(function(){
             return gaugeMaxValue/2;
         })
         .attr('id', 'scale10')
         .attr('transform', "translate(" + 0 + ", " + -130 + ")")
         .attr("font-size", 15)
         .style("fill", "#000000");


      texts.append("text")
         .text(function(){
             return gaugeMaxValue;
         })
         .attr('id', 'scale20')
         .attr('transform', "translate(" + 150 + ", " + 0 + ")")
         .attr("font-size", 15)
         .style("fill", "#000000");

        var Needle = (function() {

          //Helper function that returns the `d` value for moving the needle
          var recalcPointerPos = function(perc) {
            var centerX, centerY, leftX, leftY, rightX, rightY, thetaRad, topX, topY;
            thetaRad = percToRad(perc / 2);
            centerX = 0;
            centerY = 0;
            topX = centerX - this.len * Math.cos(thetaRad);
            topY = centerY - this.len * Math.sin(thetaRad);
            leftX = centerX - this.radius * Math.cos(thetaRad - Math.PI / 2);
            leftY = centerY - this.radius * Math.sin(thetaRad - Math.PI / 2);
            rightX = centerX - this.radius * Math.cos(thetaRad + Math.PI / 2);
            rightY = centerY - this.radius * Math.sin(thetaRad + Math.PI / 2);

            return "M " + leftX + " " + leftY + " L " + topX + " " + topY + " L " + rightX + " " + rightY;
            };

            function Needle(node) {
              this.node = node;
              this.len = width / 3;
              this.radius = this.len / 8;
            }

            Needle.prototype.render = function() {
              this.node.append('circle').attr('class', 'needle-center').attr('cx', 0).attr('cy', 0).attr('r', this.radius);
              repaintGauge();
              return this.node.append('path').attr('class', 'needle').attr('id', 'client-needle').attr('d', recalcPointerPos.call(this, percent));
              };

            return Needle;

            })();

            let needle = new Needle(chart);
            needle.render();
    })();
  }




  render() {
    return (
      <svg ref={node => this.node = node} viewBox="-40 0 400 240">
      </svg>
    )
  }
}

export default PointerGauge;
