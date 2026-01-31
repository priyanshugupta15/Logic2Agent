from PIL import Image
import os

def crop_bottom(image_path, crop_percent=0.15):
    if not os.path.exists(image_path):
        print(f"Error: {image_path} does not exist")
        return

    img = Image.open(image_path)
    width, height = img.size
    
    # Calculate how many pixels to remove from bottom
    remove_h = int(height * crop_percent)
    
    # Define the crop box (left, top, right, bottom)
    left = 0
    top = 0
    right = width
    bottom = height - remove_h
    
    if bottom > top:
        img_cropped = img.crop((left, top, right, bottom))
        img_cropped.save(image_path)
        print(f"Successfully cropped bottom by {crop_percent*100}%. New size: {img_cropped.size}")
    else:
        print("Error: Crop percentage too high.")

if __name__ == "__main__":
    hero_path = r"d:\DIVY\webDev\Projects\NeuralFlow\neuralflow\public\hero.png"
    crop_bottom(hero_path, 0.15) # Crop another 15% from the bottom
