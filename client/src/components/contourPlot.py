import numpy as np
import matplotlib.pyplot as plt
from scipy.stats import multivariate_normal
from matplotlib.colors import LinearSegmentedColormap

def style_clean_plot(ax):
    """Removes ticks, labels, and spines from a matplotlib axes object."""
    ax.set_xticks([])
    ax.set_yticks([])
    for spine in ax.spines.values():
        spine.set_visible(False)

def generate_gaussian_contour():
    """Generates a contour plot with properly placed axis labels"""
    # Set up the figure with transparent background
    plt.figure(figsize=(8, 8), facecolor='none')
    ax = plt.subplot(111)
    
    # Define the grid
    x, y = np.meshgrid(np.linspace(-3, 3, 300), np.linspace(-3, 3, 300))
    pos = np.dstack((x, y))

    # Define multiple Gaussians for a more interesting surface
    rv1 = multivariate_normal([0, 0], [[1.0, 0.3], [0.3, 1.0]])
    rv2 = multivariate_normal([1, 1], [[1.5, -0.4], [-0.4, 0.8]])
    rv3 = multivariate_normal([-1, 0.5], [[0.8, 0.1], [0.1, 1.3]])
    
    # Combine distributions
    z = rv1.pdf(pos) + 0.5 * rv2.pdf(pos) + 0.7 * rv3.pdf(pos)
    
    # Create a custom colormap with blue-green-yellow progression (no red)
    colors = [(61/255, 60/255, 132/255),    # Deep blue
              (39/255, 173/255, 213/255),   # Light blue
              (119/255, 221/255, 118/255),  # Green
              (253/255, 233/255, 146/255)]  # Yellow
    custom_cmap = LinearSegmentedColormap.from_list('custom_cmap', colors, N=256)
    
    # Draw contour plot
    contour = plt.contourf(x, y, z, 35, cmap=custom_cmap)
    
    # Add axis labels with proper styling
    plt.xlabel('Wing Sweep Angle', fontsize=14, fontweight='bold', color='white')
    plt.ylabel('Thickness-to-Chord Ratio', fontsize=14, fontweight='bold', color='white')
    
    # Add a title over the plot
    plt.title('Heat Map: Total Drag', fontsize=16, fontweight='bold', color='white')
    
    # Remove all ticks and spines for a clean look
    style_clean_plot(ax)
    
    # Set background color to match app dark theme
    ax.set_facecolor('#2a1c4a')
    
    # Adjust position for labels
    ax.xaxis.set_label_coords(0.5, -0.04)
    ax.yaxis.set_label_coords(-0.04, 0.5)
    
    # Save with transparent background
    plt.savefig('public/images/contour_plot_with_labels.png', 
                dpi=300, 
                bbox_inches='tight', 
                pad_inches=0.5,
                transparent=True)
    
    print("Contour plot with labels generated successfully.")

if __name__ == "__main__":
    generate_gaussian_contour()