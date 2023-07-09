package main

import (
	"fmt"
	"math/rand"
	"syscall/js"

	"github.com/muesli/clusters"
	"github.com/muesli/kmeans"
)

func kmeans_demo() {
	// set up a random two-dimensional data set (float64 values between 0.0 and 1.0)
	var d clusters.Observations
	for x := 0; x < 1024; x++ {
		d = append(d, clusters.Coordinates{
			rand.Float64(),
			rand.Float64(),
		})
	}

	// Partition the data points into 16 clusters
	km := kmeans.New()
	clusters, _ := km.Partition(d, 16)

	for _, c := range clusters {
		fmt.Printf("Centered at x: %.2f y: %.2f\n", c.Center[0], c.Center[1])
		fmt.Printf("Matching data points: %+v\n\n", c.Observations)
	}
}

var cb = js.NewCallback(kmeans_demo)

func main() {
	js.Global().Set("kmeans_demo", cb)
}
