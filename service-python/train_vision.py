import tensorflow as tf
from tensorflow.keras.preprocessing.image import ImageDataGenerator
from tensorflow.keras.applications import ResNet50
from tensorflow.keras.layers import Dense, GlobalAveragePooling2D
from tensorflow.keras.models import Model
from tensorflow.keras.optimizers import Adam
import os

# Dataset Path
# Dataset Path - Adjusted for new folder structure
SCRIPT_DIR = os.path.dirname(os.path.abspath(__file__))
DATA_DIR = os.path.join(SCRIPT_DIR, "Wound Detection (ResNet50)")
IMG_SIZE = (224, 224)
BATCH_SIZE = 32
EPOCHS = 5
# NUM_CLASSES will be detected dynamically from folders

def train_vision_model():
    if not os.path.exists(DATA_DIR):
        print(f"Error: Dataset directory not found at {DATA_DIR}")
        print("Please ensure the folder 'Wound Detection (ResNet50)' exists in the same directory.")
        return

    print("Setting up ImageDataGenerator...")
    # Data Augmentation for Training
    train_datagen = ImageDataGenerator(
        rescale=1./255,
        rotation_range=20,
        width_shift_range=0.2,
        height_shift_range=0.2,
        shear_range=0.2,
        zoom_range=0.2,
        horizontal_flip=True,
        validation_split=0.2 # Use 20% for validation
    )

    print(f"Loading Images from {DATA_DIR}...")
    train_generator = train_datagen.flow_from_directory(
        DATA_DIR,
        target_size=IMG_SIZE,
        batch_size=BATCH_SIZE,
        class_mode='categorical',
        subset='training'
    )

    validation_generator = train_datagen.flow_from_directory(
        DATA_DIR,
        target_size=IMG_SIZE,
        batch_size=BATCH_SIZE,
        class_mode='categorical',
        subset='validation'
    )
    
    # Check classes
    print(f"Classes found: {train_generator.class_indices}")
    print(f"Total Classes: {train_generator.num_classes}")

    # --- Model Setup ---
    print("Loading ResNet50 (Transfer Learning)...")
    base_model = ResNet50(weights='imagenet', include_top=False, input_shape=(224, 224, 3))
    
    # Freeze base layers
    for layer in base_model.layers:
        layer.trainable = False
        
    # Add Custom Head
    x = base_model.output
    x = GlobalAveragePooling2D()(x)
    x = Dense(1024, activation='relu')(x)
    predictions = Dense(train_generator.num_classes, activation='softmax')(x)
    
    model = Model(inputs=base_model.input, outputs=predictions)
    
    model.compile(optimizer=Adam(learning_rate=0.0001),
                  loss='categorical_crossentropy',
                  metrics=['accuracy'])
                  
    # --- Training ---
    print(f"Starting Training for {EPOCHS} Epochs...")
    history = model.fit(
        train_generator,
        steps_per_epoch=train_generator.samples // BATCH_SIZE,
        validation_data=validation_generator,
        validation_steps=validation_generator.samples // BATCH_SIZE,
        epochs=EPOCHS
    )
    
    # --- Save ---
    model.save('wound_model.h5')
    print("Model saved to 'wound_model.h5'")

if __name__ == "__main__":
    train_vision_model()
