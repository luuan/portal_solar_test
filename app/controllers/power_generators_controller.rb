class PowerGeneratorsController < ApplicationController
  def index
    @power_generators = PowerGenerator.order(name: :asc).page params[:page]
    @keyword = params["keyword"]
    
    unless params["keyword"].blank?
      @power_generators = @power_generators.where("name LIKE ?", "%" + @keyword.parameterize.upcase + "%").order(name: :asc).page params[:page]
    end
  end

  def get_freight
    @address = Correios::CEP::AddressFinder.new.get(params["postal_code"])

    @weight = PowerGenerator.where(id: params["pg_id"]).first.weight

    @freight = Freight.where("state = ? AND weight_min <= ? AND weight_max >= ?", @address[:state], @weight, @weight)

    @address.merge!({:freight_cost => @freight.first.cost})

    respond_to do |format|
      format.json {render json: @address}
    end

  end

  private
    def product_recommendation
      
    end
end
