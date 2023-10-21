// Tamaño del lienzo
const margin = { top: 20, right: 20, bottom: 30, left: 40 };
const width = 600 - margin.left - margin.right;
const height = 400 - margin.top - margin.bottom;

// Escala X para los años
const xScale = d3.scaleBand()
  .range([0, width])
  .padding(0.1);

// Escala Y para la facturación
const yScale = d3.scaleLinear()
  .range([height, 0]);

// Crear el lienzo SVG
const svg = d3.select("#chart")
  .append("svg")
  .attr("width", width + margin.left + margin.right)
  .attr("height", height + margin.top + margin.bottom)
  .append("g")
  .attr("transform", `translate(${margin.left},${margin.top})`);

// Cargar datos desde el archivo JSON
d3.json("datos.json").then(function (data) {
  // Asignar dominios a las escalas
  xScale.domain(data.map(d => d.Agno.toString()));
  yScale.domain([d3.min(data, d => d.Valor), d3.max(data, d => d.Valor)]);

  // Crear las barras
  svg.selectAll(".bar")
    .data(data)
    .enter().append("rect")
    .attr("class", "bar")
    .attr("x", d => xScale(d.Agno.toString()))
    .attr("width", xScale.bandwidth())
    .attr("y", d => yScale(d.Valor))
    .attr("height", d => height - yScale(d.Valor));

  // Agregar ejes
  svg.append("g")
    .attr("class", "x-axis")
    .attr("transform", `translate(0,${height})`)
    .call(d3.axisBottom(xScale));

  svg.append("g")
    .attr("class", "y-axis")
    .call(d3.axisLeft(yScale));

  // Etiquetas de ejes
  svg.selectAll(".x-axis text")
    .style("text-anchor", "end")
    .attr("dx", "-.8em")
    .attr("dy", ".15em")
    .attr("transform", "rotate(-45)");
    
   // Crear un segundo lienzo SVG para el gráfico de línea
const svgLine = d3.select("#chart")
  .append("svg")
  .attr("width", width + margin.left + margin.right)
  .attr("height", height + margin.top + margin.bottom)
  .append("g")
  .attr("transform", `translate(${margin.left},${margin.top})`);

// Crear una línea que represente la evolución de la facturación
const line = d3.line()
  .x(d => xScale(d.Agno.toString()))
  .y(d => yScale(d.Valor));

// Agregar el gráfico de línea
svgLine.append("path")
  .data([data])
  .attr("class", "line")
  .attr("d", line);

// Puntos de datos en el gráfico de línea
svgLine.selectAll(".dot")
  .data(data)
  .enter().append("circle")
  .attr("class", "dot")
  .attr("cx", d => xScale(d.Agno.toString()))
  .attr("cy", d => yScale(d.Valor))
  .attr("r", 5);

// Agregar etiquetas a los puntos
svgLine.selectAll(".dot-label")
  .data(data)
  .enter().append("text")
  .attr("class", "dot-label")
  .attr("x", d => xScale(d.Agno.toString()))
  .attr("y", d => yScale(d.Valor) - 10)
  .text(d => d.Valor);

});

