from PIL import Image
import os

def manual_vertical_crop(image_path, crop_percent=0.2):
    if not os.path.exists(image_path):
        print(f"Error: {image_path} does not exist")
        return

    img = Image.open(image_path)
    width, height = img.size
    
    # Calculate how many pixels to remove from top and bottom
    remove_h = int(height * crop_percent)
    
    # Define the crop box (left, top, right, bottom)
    left = 0
    top = remove_h
    right = width
    bottom = height - remove_h
    
    if bottom > top:
        img_cropped = img.crop((left, top, right, bottom))
        img_cropped.save(image_path)
        print(f"Successfully applied {crop_percent*100}% vertical crop. New size: {img_cropped.size}")
    else:
        print("Error: Crop percentage too high, resulting in empty image.")

if __name__ == "__main__":
    hero_path = r"d:\DIVY\webDev\Projects\NeuralFlow\neuralflow\public\hero.png"
    manual_vertical_crop(hero_path, 0.2) # Crop 20% from both top and bottom
