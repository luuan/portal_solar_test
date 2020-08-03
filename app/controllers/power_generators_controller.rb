class PowerGeneratorsController < ApplicationController
  def index
    @power_generators = PowerGenerator.order(name: :asc).page params[:page]
    @keyword = params["keyword"]
    
    unless params["keyword"].blank?
      @power_generators = @power_generators.where("name LIKE ?", "%" + @keyword.parameterize.upcase + "%").order(name: :asc).page params[:page]
    end
    unless params["income"].blank? && params["postal_code"].blank? && params["wish_price"].blank? && params["performance"].blank?
      @power_generators = product_recommendation
    end
  end

  def get_freight
    address = Correios::CEP::AddressFinder.new.get(params["postal_code"])

    pg_data = PowerGenerator.where(id: params["pg_id"]).first
    if pg_data.cubed_weight.blank?
      create_cubed_weight pg_data
    end
    weight = pg_data.weight
    freight = Freight.where("state = ? AND weight_min <= ? AND weight_max >= ?", address[:state], weight, weight)

    address.merge!({:freight_cost => freight.first.cost, :cubed_weight => pg_data.cubed_weight})

    respond_to do |format|
      format.json {render json: address}
    end

  end

  private
    def product_recommendation
      unless params["postal_code"].blank?
        address = Correios::CEP::AddressFinder.new.get(params["postal_code"])
      end
      weight = PowerGenerator.where(id: params["pg_id"]).first

      params["income"]
      params["wish_price"]
      params["performance"]
    end

    def create_cubed_weight pg_data
      height = pg_data.height
      weight = pg_data.weight
      lenght = pg_data.lenght
      cubed_factor = 300

      cubed_weight = height * weight * lenght * cubed_factor

      pg_data.update_attribute(:cubed_weight, cubed_weight)
    end
end
