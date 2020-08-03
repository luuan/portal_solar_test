Rails.application.routes.draw do
  root to: 'power_generators#index'
  resources :home, only: %i[index]
  resources :power_generators do
    collection do
      get 'get_freight'
      get 'filter'
    end
  end
end
