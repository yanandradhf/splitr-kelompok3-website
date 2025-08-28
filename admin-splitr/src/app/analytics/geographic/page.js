"use client";
import { useState, useEffect } from "react";
import { DashboardLayout, Select, SkeletonChart, SkeletonList, SkeletonTable } from "../../../components";
import useAnalyticsStore from "../../../store/analyticsStore";
import { formatCurrency } from "../../../utils/formatters";
import dynamic from "next/dynamic";

const MapContainer = dynamic(() => import('react-leaflet').then(mod => mod.MapContainer), { ssr: false });
const TileLayer = dynamic(() => import('react-leaflet').then(mod => mod.TileLayer), { ssr: false });
const CircleMarker = dynamic(() => import('react-leaflet').then(mod => mod.CircleMarker), { ssr: false });
const Popup = dynamic(() => import('react-leaflet').then(mod => mod.Popup), { ssr: false });

export default function GeographicAnalytics() {
  const [mapLoaded, setMapLoaded] = useState(false);
  
  // Zustand stores
  const { geographicData: data, loading, period, setPeriod, fetchGeographicData } = useAnalyticsStore();

  // Initial fetch
  useEffect(() => {
    fetchGeographicData();
  }, []);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const link = document.createElement('link');
      link.rel = 'stylesheet';
      link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
      document.head.appendChild(link);
      setMapLoaded(true);
    }
  }, []);



  const getIntensityColor = (intensity) => {
    if (intensity >= 40) return "bg-red-500";
    if (intensity >= 25) return "bg-orange-500";
    if (intensity >= 15) return "bg-yellow-500";
    return "bg-green-500";
  };

  const getIntensitySize = (intensity) => {
    if (intensity >= 40) return "w-6 h-6";
    if (intensity >= 25) return "w-5 h-5";
    if (intensity >= 15) return "w-4 h-4";
    return "w-3 h-3";
  };



  return (
    <DashboardLayout 
      title="Geographic Analytics" 
      subtitle="Transaction distribution and branch activity across Indonesia"
    >
            {/* Filter Section */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 mb-6">
              <div className="p-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-gray-900">
                    Time Period
                  </h3>
                  <Select
                    value={period}
                    onChange={(e) => setPeriod(e.target.value)}
                    options={[
                      { value: "7days", label: "Last 7 Days" },
                      { value: "30days", label: "Last 30 Days" },
                      { value: "thismonth", label: "This Month" },
                      { value: "year", label: "This Year" }
                    ]}
                  />
                </div>
              </div>
            </div>

            {loading ? (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <SkeletonChart height="384px" />
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                  <div className="mb-4">
                    <div className="h-6 bg-gray-200 rounded w-48 mb-4"></div>
                  </div>
                  <SkeletonList items={6} />
                </div>
                <div className="lg:col-span-2">
                  <SkeletonTable rows={8} cols={5} />
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Leaflet Map */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-100">
                  <div className="p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">
                      Indonesia Branch Heatmap
                    </h3>
                    <div className="h-96 rounded-lg overflow-hidden">
                      {mapLoaded ? (
                        <MapContainer
                          center={[-2.5, 118]}
                          zoom={5}
                          style={{ height: '100%', width: '100%' }}
                        >
                          <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                          {data.heatmapData?.map((branch, index) => {
                            const color = branch.intensity >= 40 ? '#ef4444' : 
                                         branch.intensity >= 25 ? '#f97316' : 
                                         branch.intensity >= 15 ? '#eab308' : '#22c55e';
                            const radius = branch.intensity >= 40 ? 15 : 
                                          branch.intensity >= 25 ? 12 : 
                                          branch.intensity >= 15 ? 9 : 6;
                            
                            return (
                              <CircleMarker
                                key={`marker-${branch.branchCode}-${index}`}
                                center={[branch.latitude, branch.longitude]}
                                radius={radius}
                                pathOptions={{ color, fillColor: color, fillOpacity: 0.6, weight: 2 }}
                              >
                                <Popup>
                                  <div>
                                    <strong>{branch.branchName}</strong><br/>
                                    {branch.city} ({branch.branchCode})<br/>
                                    Amount: {formatCurrency(branch.amount)}<br/>
                                    Transactions: {branch.transactions}
                                  </div>
                                </Popup>
                              </CircleMarker>
                            );
                          })}
                        </MapContainer>
                      ) : (
                        <div className="h-full bg-gray-100 flex items-center justify-center">
                          <div className="text-gray-500">Loading map...</div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Branch Heatmap Legend */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-100">
                  <div className="p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">
                      Branch Activity Heatmap
                    </h3>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <span className="text-sm font-medium text-gray-700">Intensity Legend:</span>
                        <div className="flex items-center space-x-3">
                          <div className="flex items-center space-x-1">
                            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                            <span className="text-xs text-gray-600">Low (1-14)</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <div className="w-4 h-4 bg-yellow-500 rounded-full"></div>
                            <span className="text-xs text-gray-600">Medium (15-24)</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <div className="w-5 h-5 bg-orange-500 rounded-full"></div>
                            <span className="text-xs text-gray-600">High (25-39)</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <div className="w-6 h-6 bg-red-500 rounded-full"></div>
                            <span className="text-xs text-gray-600">Very High (40+)</span>
                          </div>
                        </div>
                      </div>
                      <div className="max-h-80 overflow-y-auto space-y-2">
                        {data.heatmapData.length === 0 ? (
                          <div className="text-center py-8 text-gray-500">
                            No branch data available
                          </div>
                        ) : (
                          data.heatmapData.map((branch, index) => (
                            <div
                              key={`branch-list-${branch.branchCode}-${index}`}
                              className="flex items-center justify-between p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                            >
                              <div className="flex items-center space-x-3">
                                <div className={`${getIntensitySize(branch.intensity)} ${getIntensityColor(branch.intensity)} rounded-full`}></div>
                                <div>
                                  <div className="font-medium text-gray-900">{branch.branchName}</div>
                                  <div className="text-sm text-gray-500">{branch.city} ({branch.branchCode})</div>
                                </div>
                              </div>
                              <div className="text-right">
                                <div className="font-semibold text-gray-900">{formatCurrency(branch.amount)}</div>
                                <div className="text-sm text-gray-500">{branch.transactions} transactions</div>
                              </div>
                            </div>
                          ))
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Branch Details Table */}
                <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-gray-100">
                  <div className="p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">
                      Branch Transaction Details
                    </h3>
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead className="bg-gray-50">
                          <tr>
                            <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">
                              Branch
                            </th>
                            <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">
                              Location
                            </th>
                            <th className="px-4 py-3 text-center text-sm font-semibold text-gray-900">
                              Transactions
                            </th>
                            <th className="px-4 py-3 text-center text-sm font-semibold text-gray-900">
                              Intensity
                            </th>
                            <th className="px-4 py-3 text-right text-sm font-semibold text-gray-900">
                              Total Amount
                            </th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                          {data.heatmapData.length === 0 ? (
                            <tr>
                              <td colSpan="5" className="px-4 py-8 text-center text-gray-500">
                                No branch data available
                              </td>
                            </tr>
                          ) : (
                            data.heatmapData.map((branch, index) => (
                              <tr key={`branch-table-${branch.branchCode}-${index}`} className="hover:bg-gray-50">
                                <td className="px-4 py-3">
                                  <div>
                                    <div className="font-medium text-gray-900">
                                      {branch.branchName}
                                    </div>
                                    <div className="text-sm text-gray-500">
                                      {branch.branchCode}
                                    </div>
                                  </div>
                                </td>
                                <td className="px-4 py-3">
                                  <div className="font-medium text-gray-900">
                                    {branch.city}
                                  </div>
                                  <div className="text-xs text-gray-500">
                                    {branch.latitude.toFixed(4)}, {branch.longitude.toFixed(4)}
                                  </div>
                                </td>
                                <td className="px-4 py-3 text-center">
                                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                    {branch.transactions}
                                  </span>
                                </td>
                                <td className="px-4 py-3 text-center">
                                  <div className="flex items-center justify-center">
                                    <div className={`${getIntensitySize(branch.intensity)} ${getIntensityColor(branch.intensity)} rounded-full mr-2`}></div>
                                    <span className="text-sm font-medium">{branch.intensity}</span>
                                  </div>
                                </td>
                                <td className="px-4 py-3 text-right font-semibold text-gray-900">
                                  {formatCurrency(branch.amount)}
                                </td>
                              </tr>
                            ))
                          )}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              </div>
            )}
    </DashboardLayout>
  );
}