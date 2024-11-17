package main

import (
	"fmt"
	"log"
	"net/http"
	"os"
	"path/filepath"

	"github.com/PuerkitoBio/goquery"
)

func main() {
	// Base URL for the Premier League players page
	baseURL := "https://www.premierleague.com/players"

	// Fetch the page
	res, err := http.Get(baseURL)
	if err != nil {
		log.Fatalf("Failed to fetch URL: %v", err)
	}
	defer res.Body.Close()

	if res.StatusCode != http.StatusOK {
		log.Fatalf("Error status code: %d", res.StatusCode)
	}

	// Parse the page using goquery
	doc, err := goquery.NewDocumentFromReader(res.Body)
	if err != nil {
		log.Fatalf("Failed to parse HTML: %v", err)
	}

	// Create a directory to save headshots
	outputDir := "player_headshots"
	err = os.MkdirAll(outputDir, os.ModePerm)
	if err != nil {
		log.Fatalf("Failed to create directory: %v", err)
	}

	// Find player links and headshots
	doc.Find("a.playerName").Each(func(index int, item *goquery.Selection) {
		playerLink, exists := item.Attr("href")
		if !exists {
			log.Printf("Player link not found for item %d", index)
			return
		}

		// Build the player page URL
		playerURL := fmt.Sprintf("https://www.premierleague.com%s", playerLink)

		// Fetch the player's page
		playerRes, err := http.Get(playerURL)
		if err != nil {
			log.Printf("Failed to fetch player page: %v", err)
			return
		}
		defer playerRes.Body.Close()

		// Parse the player page
		playerDoc, err := goquery.NewDocumentFromReader(playerRes.Body)
		if err != nil {
			log.Printf("Failed to parse player page: %v", err)
			return
		}

		// Find the player image
		imageURL, exists := playerDoc.Find("img.playerImage").Attr("src")
		if !exists {
			log.Printf("Image URL not found for player at %s", playerURL)
			return
		}

		// Get the player's name
		playerName := item.Text()
		fileName := fmt.Sprintf("%s.jpg", playerName)
		filePath := filepath.Join(outputDir, fileName)

		// Download the image
		err = downloadImage(imageURL, filePath)
		if err != nil {
			log.Printf("Failed to download image for %s: %v", playerName, err)
		} else {
			log.Printf("Saved headshot for %s", playerName)
		}
	})
}

// downloadImage downloads an image from the given URL and saves it to the specified file path
func downloadImage(url, filePath string) error {
	res, err := http.Get(url)
	if err != nil {
		return err
	}
	defer res.Body.Close()

	if res.StatusCode != http.StatusOK {
		return fmt.Errorf("failed to download image, status code: %d", res.StatusCode)
	}

	file, err := os.Create(filePath)
	if err != nil {
		return err
	}
	defer file.Close()

	_, err = file.ReadFrom(res.Body)
	return err
}
