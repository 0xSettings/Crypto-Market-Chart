package main

import (
	"fmt"
	"net/http"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
	"github.com/go-resty/resty/v2"
)

type SparklineData struct {
	Prices []float64 `json:"price"`
}

type CryptoData struct {
	ID        string    `json:"id"`
	Symbol    string    `json:"symbol"`
	Name      string    `json:"name"`
	Price     float64   `json:"current_price"`
	Change    float64   `json:"price_change_percentage_24h"`
	MarketCap float64   `json:"market_cap"`
	Volume24h float64   `json:"total_volume"`
	Supply    float64   `json:"circulating_supply"`
	Sparkline []float64 `json:"sparkline_in_7d.price"`
}

func fetchCryptoData() ([]CryptoData, error) {
	client := resty.New()
	var data []CryptoData

	resp, err := client.R().
		SetResult(&data).
		Get("https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&sparkline=true")
	if err != nil {
		return nil, err
	}

	if resp.IsError() {
		return nil, fmt.Errorf("API request failed with status: %s", resp.Status())
	}

	return data, nil
}

func main() {
	router := gin.Default()

	// Enable CORS for localhost:3000
	router.Use(cors.New(cors.Config{
		AllowOrigins: []string{"http://localhost:3000"},
		AllowMethods: []string{"GET", "POST", "PUT", "DELETE"},
		AllowHeaders: []string{"Content-Type"},
	}))

	router.GET("/api/crypto", func(c *gin.Context) {
		data, err := fetchCryptoData()
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
			return
		}
		c.JSON(http.StatusOK, data)
	})

	router.Run(":8080")
}
