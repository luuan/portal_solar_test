class AddCubedWeightToPowerGenerator < ActiveRecord::Migration[5.2]
  def change
    add_column :power_generators, :cubed_weight, :float
  end
end
